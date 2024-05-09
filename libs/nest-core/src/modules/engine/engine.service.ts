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
  ExecuteExtractConnectorMetadata,
  ExecuteFlowOperation,
  ExecutePropsOptions,
  ExecuteStepOperation,
  ExecuteTriggerOperation,
  ExecuteValidateAuthOperation,
  Id,
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
import { AppEventRoutingService } from '../app-event-routing/app-event-routing.service'
import { ConnectorsMetadataService } from '../flows/connectors/connectors-metadata/connectors-metadata.service'
import { AuthService } from '../users/auth/auth.service'
import { WebhookSecretsService } from '../webhooks/webhook-secrets/webhook-secrets.service'
import { SandboxProvisionerService } from '../workers/sandbox/sandbox-provisioner.service'
import { Sandbox } from '../workers/sandbox/sandboxes/sandbox'
import {
  EngineHelperActionResult,
  EngineHelperExtractConnectorInformation,
  EngineHelperFlowResult,
  EngineHelperPropResult,
  EngineHelperResponse,
  EngineHelperResult,
  EngineHelperTriggerResult,
  EngineHelperValidateAuthResult,
} from './types'

@Injectable()
export class EngineService {
	private readonly logger = new Logger(EngineService.name)
	private serverUrl = ''

	constructor(
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly sandboxProvisionerService: SandboxProvisionerService,
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly appEventRoutingService: AppEventRoutingService,
		private readonly webhookSecretsService: WebhookSecretsService,
	) {
		this.serverUrl = this.configService.getOrThrow('API_GATEWAY_URL')
		assertNotNullOrUndefined(this.serverUrl, 'serverUrl', {
			serverUrl: this.serverUrl,
		})
	}

	private async _getSandboxForAction(projectId: Id, flowId: Id, action: Action): Promise<Sandbox> {
		switch (action.type) {
			case ActionType.CONNECTOR: {
				const { packageType, connectorType, connectorName, connectorVersion } = action.settings
				const connector = {
					packageType,
					connectorType,
					connectorName,
					connectorVersion,
				}

				return this.sandboxProvisionerService.provision({
					type: SandBoxCacheType.CONNECTOR,
					connectorName: connector.connectorName,
					connectorVersion: connector.connectorVersion,
					connectors: [await this.connectorsMetadataService.getConnectorPackage(projectId, connector)],
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
				return this.sandboxProvisionerService.provision({
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
			this.logger.debug(`#execute:`, { operation, sandboxId: sandbox.boxId })

			const sandboxPath = sandbox.getSandboxFolderPath()

			await fs.writeFile(`${sandboxPath}/input.json`, JSON.stringify(input))
			const sandboxResponse = await sandbox.runOperation(operation)

			sandboxResponse.standardOutput.split('\n').forEach((f) => {
				// if (f.trim().length > 0) this.logger.debug(f)
			})

			/* Returning  sandboxResponse.standardError to frontend can be dangerous, so only log here*/

			// TODO fix this error in engine, now only remove
			sandboxResponse.standardError = sandboxResponse.standardError.replace(
				/\(node:\d*\) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.\s+\(Use `node --trace-warnings ...` to show where the warning was created\)/,
				'',
			)

			sandboxResponse.standardError.split('\n').forEach((f) => {
				if (f.trim().length > 0) this.logger.error(`${operation} ${f}`)
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
		this.logger.debug(`#executeFlow:`, {
			executionType: operation.executionType,
			flowRunId: operation.flowRunId,
			projectId: operation.projectId,
			sandboxId: sandbox.boxId,
		})

		const input: ExecuteFlowOperation = {
			...operation,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					projectId: operation.projectId,
					sub: `${operation.flowVersion._id}-executeFlow-${operation.flowRunId}`,
					type: JWTPrincipalType.WORKER,
				},
			}),
			serverUrl: this.serverUrl,
		}
		return this._execute(EngineOperationType.EXECUTE_FLOW, sandbox, input)
	}

	async executeProp(operation: Omit<ExecutePropsOptions, EngineConstants>): Promise<EngineHelperResponse<EngineHelperPropResult>> {
		this.logger.debug(`#executeProp:`, {
			connector: operation.connector,
			projectId: operation.projectId,
			stepName: operation.stepName,
		})

		const { connector } = operation

		connector.connectorVersion = await this.connectorsMetadataService.getExactConnectorVersion({
			name: connector.connectorName,
			version: connector.connectorVersion,
			projectId: operation.projectId,
		})

		const sandbox = await this.sandboxProvisionerService.provision({
			type: SandBoxCacheType.CONNECTOR,
			connectorName: connector.connectorName,
			connectorVersion: connector.connectorVersion,
			connectors: [connector],
		})

		const input = {
			...operation,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					projectId: operation.projectId,
					sub: `${operation.flowVersion._id}-executeProp-${operation.propertyName}`,
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_PROPERTY, sandbox, input)
	}

	async extractPieceMetadata(operation: ExecuteExtractConnectorMetadata): Promise<EngineHelperResponse<EngineHelperExtractConnectorInformation>> {
		this.logger.debug(`#extractPieceMetadata:`, { operation })

		const { connectorName, connectorVersion } = operation
		const connector = operation

		const sandbox = await this.sandboxProvisionerService.provision({
			type: SandBoxCacheType.CONNECTOR,
			connectorName,
			connectorVersion,
			connectors: [connector],
		})

		return this._execute(EngineOperationType.EXTRACT_CONNECTOR_METADATA, sandbox, operation)
	}

	async executeAction(operation: Omit<ExecuteStepOperation, EngineConstants>): Promise<EngineHelperResponse<EngineHelperActionResult>> {
		this.logger.debug(`#executeAction:`, {
			flowVersionId: operation.flowVersion._id,
			stepName: operation.stepName,
			projectId: operation.projectId,
		})
		// const lockedFlowVersion = await lockPieceAction(operation)
		const clonedFlowVersion = clone(operation.flowVersion)
		const step = flowHelper.getAction(clonedFlowVersion, operation.stepName)
		assertNotNullOrUndefined(step, 'Step not found')

		const sandbox = await this._getSandboxForAction(operation.projectId, operation.flowVersion.flowId, step)
		const input: ExecuteStepOperation = {
			// flowVersion: lockedFlowVersion,
			flowVersion: clonedFlowVersion,
			stepName: operation.stepName,
			projectId: operation.projectId,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					projectId: operation.projectId,
					sub: `${operation.flowVersion._id}-executeAction-${step.settings.actionName}`,
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_STEP, sandbox, input)
	}

	async executeValidateAuth(
		operation: Omit<ExecuteValidateAuthOperation, EngineConstants>,
	): Promise<EngineHelperResponse<EngineHelperValidateAuthResult>> {
		this.logger.debug(`#executeValidateAuth:`, { connector: operation.connector, projectId: operation.projectId })

		const { connector } = operation

		connector.connectorVersion = await this.connectorsMetadataService.getExactConnectorVersion({
			name: connector.connectorName,
			version: connector.connectorVersion,
			projectId: operation.projectId,
		})

		const sandbox = await this.sandboxProvisionerService.provision({
			type: SandBoxCacheType.CONNECTOR,
			connectorName: connector.connectorName,
			connectorVersion: connector.connectorVersion,
			connectors: [connector],
		})

		const input = {
			...operation,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					projectId: operation.projectId,
					sub: `executeValidateAuth-${operation.connector.connectorName}`,
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_VALIDATE_AUTH, sandbox, input)
	}

	async executeTrigger<T extends TriggerHookType>(
		operation: Omit<ExecuteTriggerOperation<T>, EngineConstants>,
	): Promise<EngineHelperResponse<EngineHelperTriggerResult<T>>> {
		this.logger.debug(`#executeTrigger:`, {
			hookType: operation.hookType,
			projectId: operation.projectId,
			triggerName: operation.triggerName,
			triggerPayload: operation.triggerPayload,
			webhookUrl: operation.webhookUrl,
		})

		// todo lock flow version
		const clonedFlowVersion = clone(operation.flowVersion)

		const trigger = clonedFlowVersion.triggers.find((trigger) => trigger.name === operation.triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger`)
		if (!isConnectorTrigger(trigger)) throw new UnprocessableEntityException(`Can not perform operation on non Connector trigger`)

		const { packageType, connectorType, connectorName, connectorVersion } = trigger.settings

		const exactConnectorVersion = await this.connectorsMetadataService.getExactConnectorVersion({
			name: connectorName,
			version: connectorVersion,
			projectId: operation.projectId,
		})

		const sandbox = await this.sandboxProvisionerService.provision({
			type: SandBoxCacheType.CONNECTOR,
			connectorName,
			connectorVersion: exactConnectorVersion,
			connectors: [
				// TODO to execute private connectors implement logic in getPiecePackage
				await this.connectorsMetadataService.getConnectorPackage(operation.projectId, {
					packageType,
					connectorType,
					connectorName,
					connectorVersion: exactConnectorVersion,
				}),
			],
		})

		this.logger.debug(`#executeTrigger provised sandbox:`, {
			inUse: sandbox.inUse,
			boxId: sandbox.boxId,
			cacheKey: sandbox.cacheKey,
		})

		const input = {
			...operation,
			connectorVersion: exactConnectorVersion,
			flowVersion: clonedFlowVersion,
			// edition: getEdition(),
			appWebhookUrl: this.appEventRoutingService.getAppWebhookUrl({
				appName: connectorName,
			}),
			serverUrl: this.serverUrl,
			webhookSecret: this.webhookSecretsService.getWebhookSecret(connectorName),
			workerToken: this.authService.generateWorkerToken({
				payload: {
					projectId: operation.projectId,
					sub: `${operation.flowVersion._id}-executeTrigger-${trigger.settings.triggerName}`,
					type: JWTPrincipalType.WORKER,
				},
			}),
		}

		return this._execute(EngineOperationType.EXECUTE_TRIGGER_HOOK, sandbox, input)
	}

	async executeTest(sandbox: Sandbox, operation: Omit<EngineTestOperation, EngineConstants>): Promise<EngineHelperResponse<EngineHelperFlowResult>> {
		this.logger.debug(`#executeTest:`, {
			flowVersionId: operation.sourceFlowVersion._id,
			projectId: operation.projectId,
			sandboxId: sandbox.boxId,
			executionType: operation.executionType,
		})

		return this._execute(EngineOperationType.EXECUTE_TEST_FLOW, sandbox, {
			...operation,
			serverUrl: this.serverUrl,
			workerToken: this.authService.generateWorkerToken({
				payload: {
					projectId: operation.projectId,
					sub: `${operation.flowVersion._id}-executeTest-${operation.flowRunId}`,
					type: JWTPrincipalType.WORKER,
				},
			}),
		})
	}
}

type EngineConstants = 'serverUrl' | 'workerToken'
