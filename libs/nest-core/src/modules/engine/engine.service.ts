import { ConnectorMetadata, DynamicPropsValue, StaticDropdownState } from '@linkerry/connectors-framework'
import {
	Action,
	ActionType,
	BeginExecuteFlowOperation,
	CustomError,
	EngineOperation,
	EngineOperationType,
	EngineResponseStatus,
	EngineTestOperation,
	ErrorCode,
	ExecuteActionResponse,
	ExecuteExtractConnectorMetadata,
	ExecuteFlowOperation,
	ExecutePropsOptions,
	ExecuteStepOperation,
	ExecuteTriggerOperation,
	ExecuteTriggerResponse,
	ExecuteValidateAuthOperation,
	ExecuteValidateAuthResponse,
	ExecutionOutput,
	JWTPrincipalType,
	ResumeExecuteFlowOperation,
	SandBoxCacheType,
	TriggerHookType,
	assertNotNullOrUndefined,
	clone,
	flowHelper,
	isConnectorTrigger,
	tryParseJson,
} from '@linkerry/shared'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fs from 'fs/promises'
import { AuthService } from '../../lib/auth/auth.service'
import { ConnectorsMetadataService } from '../flows/connectors/connectors-metadata/connectors-metadata.service'
import { SandboxProvisionerService } from '../workers/sandbox/sandbox-provisioner.service'
import { Sandbox } from '../workers/sandbox/sandboxes/sandbox'

export type EngineHelperFlowResult = ExecutionOutput

export type EngineHelperTriggerResult<T extends TriggerHookType = TriggerHookType> = ExecuteTriggerResponse<T>

export type EngineHelperPropResult = StaticDropdownState<unknown> | Record<string, DynamicPropsValue>

export type EngineHelperActionResult = ExecuteActionResponse

export type EngineHelperValidateAuthResult = ExecuteValidateAuthResponse

export type EngineHelperCodeResult = ExecuteActionResponse
export type EngineHelperExtractConnectorInformation = Omit<ConnectorMetadata, 'name' | 'version'>

export type EngineHelperResult =
	| EngineHelperFlowResult
	| EngineHelperTriggerResult
	| EngineHelperPropResult
	| EngineHelperCodeResult
	| EngineHelperExtractConnectorInformation
	| EngineHelperActionResult
	| EngineHelperValidateAuthResult

export type EngineHelperResponse<Result extends EngineHelperResult> = {
	status: EngineResponseStatus
	result: Result
	standardError: string
	standardOutput: string
}

@Injectable()
export class EngineService {
	private readonly logger = new Logger(EngineService.name)
	private serverUrl = ''

	constructor(
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly sandboxProvisionerService: SandboxProvisionerService,
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
		this.serverUrl = this.configService.getOrThrow('SERVER_URL')
		assertNotNullOrUndefined(this.serverUrl, 'serverUrl', {
			serverUrl: this.serverUrl,
		})
	}

	private async _getSandboxForAction(
		// projectId: string,
		flowId: string,
		action: Action,
	): Promise<Sandbox> {
		switch (action.type) {
			case ActionType.CONNECTOR: {
				const {
					//  packageType,
					connectorType,
					connectorName,
					connectorVersion,
				} = action.settings
				const connector = {
					// packageType,
					connectorType,
					connectorName,
					connectorVersion,
					// projectId,
				}

				return this.sandboxProvisionerService.provisionSandbox({
					type: SandBoxCacheType.CONNECTOR,
					connectorName: connector.connectorName,
					connectorVersion: connector.connectorVersion,
					connectors: [connector],
					// projectId,
				})
			}
			// case ActionType.CODE: {
			//     return sandboxProvisioner.provision({
			//         type: SandBoxCacheType.CODE,
			//         projectId,
			//         flowId,
			//         name: action.name,
			//         sourceCodeHash: hashObject(action.settings.sourceCode),
			//         codeSteps: [
			//             {
			//                 name: action.name,
			//                 sourceCode: action.settings.sourceCode,
			//             },
			//         ],
			//     })
			// }
			case ActionType.BRANCH:
				// todo uncomment after implementing MERGE_BRANCH and LOOP_ON_ITEMS
				// case ActionType.MERGE_BRANCH:
				// case ActionType.LOOP_ON_ITEMS:
				return this.sandboxProvisionerService.provisionSandbox({
					type: SandBoxCacheType.NONE,
					// projectId,
				})
		}
	}

	private async _execute<Result extends EngineHelperResult>(
		operation: EngineOperationType,
		sandbox: Sandbox,
		input: EngineOperation,
	): Promise<EngineHelperResponse<Result>> {
		try {
			this.logger.debug(`#execute`, { operation, sandboxId: sandbox.boxId })

			const sandboxPath = sandbox.getSandboxFolderPath()

			await fs.writeFile(`${sandboxPath}/input.json`, JSON.stringify(input))
			const sandboxResponse = await sandbox.runOperation(operation)

			sandboxResponse.standardOutput.split('\n').forEach((f) => {
				if (f.trim().length > 0) this.logger.debug(f)
			})

			sandboxResponse.standardError.split('\n').forEach((f) => {
				if (f.trim().length > 0) this.logger.error(f)
			})

			if (sandboxResponse.verdict === EngineResponseStatus.TIMEOUT) {
				throw new CustomError('Engine execution timeout', ErrorCode.EXECUTION_TIMEOUT)
			}

			const result = tryParseJson<Result>(sandboxResponse.output)

			const response = {
				status: sandboxResponse.verdict,
				result,
				standardError: sandboxResponse.standardError,
				standardOutput: sandboxResponse.standardOutput,
			}

			return response
		} finally {
			await this.sandboxProvisionerService.releaseSandbox({ sandbox })
		}
	}

	async executeFlow(
		sandbox: Sandbox,
		operation: Omit<BeginExecuteFlowOperation, EngineConstants> | Omit<ResumeExecuteFlowOperation, EngineConstants>,
	): Promise<EngineHelperResponse<EngineHelperFlowResult>> {
		this.logger.debug(`#executeFlow`, {
			executionType: operation.executionType,
			flowRunId: operation.flowRunId,
			// projectId: operation.projectId,
			sandboxId: sandbox.boxId,
		})

		const input: ExecuteFlowOperation = {
			...operation,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					sub: '',
					type: JWTPrincipalType.WORKER,
				},
			}),
			serverUrl: this.serverUrl,
		}
		return this._execute(EngineOperationType.EXECUTE_FLOW, sandbox, input)
	}

	async executeProp(operation: Omit<ExecutePropsOptions, EngineConstants>): Promise<EngineHelperResponse<EngineHelperPropResult>> {
		this.logger.debug(`#executeProp`, {
			connector: operation.connector,
			// projectId: operation.projectId,
			stepName: operation.stepName,
		})

		const { connector } = operation

		connector.connectorVersion = await this.connectorsMetadataService.getExactPieceVersion({
			name: connector.connectorName,
			version: connector.connectorVersion,
			// projectId: operation.projectId,
		})

		const sandbox = await this.sandboxProvisionerService.provisionSandbox({
			type: SandBoxCacheType.CONNECTOR,
			connectorName: connector.connectorName,
			// projectId: operation.projectId,
			connectorVersion: connector.connectorVersion,
			connectors: [connector],
		})

		const input = {
			...operation,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					sub: '',
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_PROPERTY, sandbox, input)
	}

	async extractPieceMetadata(operation: ExecuteExtractConnectorMetadata): Promise<EngineHelperResponse<EngineHelperExtractConnectorInformation>> {
		this.logger.debug(`#extractPieceMetadata`, { operation })

		const { connectorName, connectorVersion } = operation
		const connector = operation

		const sandbox = await this.sandboxProvisionerService.provisionSandbox({
			type: SandBoxCacheType.CONNECTOR,
			connectorName,
			connectorVersion,
			// projectId: operation.projectId,
			connectors: [connector],
		})

		return this._execute(EngineOperationType.EXTRACT_CONNECTOR_METADATA, sandbox, operation)
	}

	async executeAction(operation: Omit<ExecuteStepOperation, EngineConstants>): Promise<EngineHelperResponse<EngineHelperActionResult>> {
		this.logger.debug(`#executeAction`, {
			flowVersionId: operation.flowVersion._id,
			stepName: operation.stepName,
		})
		// const lockedFlowVersion = await lockPieceAction(operation)
		const clonedFlowVersion = clone(operation.flowVersion)
		const step = flowHelper.getAction(clonedFlowVersion, operation.stepName)
		assertNotNullOrUndefined(step, 'Step not found')

		const sandbox = await this._getSandboxForAction(
			// operation.projectId,
			operation.flowVersion.flow,
			step,
		)
		const input: ExecuteStepOperation = {
			// flowVersion: lockedFlowVersion,
			flowVersion: clonedFlowVersion,
			stepName: operation.stepName,
			// projectId: operation.projectId,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					sub: '',
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_STEP, sandbox, input)
	}

	async executeValidateAuth(
		operation: Omit<ExecuteValidateAuthOperation, EngineConstants>,
	): Promise<EngineHelperResponse<EngineHelperValidateAuthResult>> {
		this.logger.debug(`#executeValidateAuth`, { connecotr: operation.connector })

		const { connector } = operation

		connector.connectorVersion = await this.connectorsMetadataService.getExactPieceVersion({
			name: connector.connectorName,
			version: connector.connectorVersion,
			// projectId: operation.projectId,
		})

		const sandbox = await this.sandboxProvisionerService.provisionSandbox({
			type: SandBoxCacheType.CONNECTOR,
			connectorName: connector.connectorName,
			connectorVersion: connector.connectorVersion,
			connectors: [connector],
			// projectId: operation.projectId,
		})

		const input = {
			...operation,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					sub: '',
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_VALIDATE_AUTH, sandbox, input)
	}

	async executeTrigger<T extends TriggerHookType>(
		operation: Omit<ExecuteTriggerOperation<T>, EngineConstants>,
	): Promise<EngineHelperResponse<EngineHelperTriggerResult<T>>> {
		this.logger.debug(`#executeTrigger hookType: ${operation.hookType}`)

		// todo lock flow version
		const clonedFlowVersion = clone(operation.flowVersion)

		const trigger = clonedFlowVersion.triggers.find((trigger) => trigger.name === operation.triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger`)
		if (!isConnectorTrigger(trigger)) throw new UnprocessableEntityException(`Can not perform operation on non Connector trigger`)

		const { connectorType, connectorName, connectorVersion } = trigger.settings
		const connectorMetadataFixedVersion = await this.connectorsMetadataService.getExactPieceVersion({
			name: connectorName,
			version: connectorVersion,
			// projectId: operation.projectId,
		})

		const sandbox = await this.sandboxProvisionerService.provisionSandbox({
			type: SandBoxCacheType.CONNECTOR,
			connectorName,
			// projectId: operation.projectId,
			connectorVersion: connectorMetadataFixedVersion,
			connectors: [
				{
					connectorType,
					connectorName,
					connectorVersion,
				},
			],
		})
		this.logger.debug(`#executeTrigger provised sandbox: ${sandbox.boxId}`)

		const input = {
			...operation,
			connectorVersion: connectorMetadataFixedVersion,
			flowVersion: clonedFlowVersion,
			// edition: getEdition(),
			appWebhookUrl: '',
			// appWebhookUrl: await appEventRoutingService.getAppWebhookUrl({
			// 		appName: connectorName,
			// }),
			serverUrl: this.serverUrl,
			// webhookSecret: await getWebhookSecret(operation.flowVersion),
			// workerToken: await generateWorkerToken({ projectId: operation.projectId }),
			workerToken: this.authService.generateWorkerToken({
				payload: {
					sub: '',
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_TRIGGER_HOOK, sandbox, input)
	}

	async executeTest(sandbox: Sandbox, operation: Omit<EngineTestOperation, EngineConstants>): Promise<EngineHelperResponse<EngineHelperFlowResult>> {
		this.logger.debug(`#executeTest`, {
			flowVersionId: operation.sourceFlowVersion._id,
			// projectId: operation.projectId,
			sandboxId: sandbox.boxId,
			executionType: operation.executionType,
		})

		return this._execute(EngineOperationType.EXECUTE_TEST_FLOW, sandbox, {
			...operation,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					sub: '',
					type: JWTPrincipalType.WORKER,
				},
			}),
		})
	}
}

type EngineConstants = 'serverUrl' | 'workerToken'
