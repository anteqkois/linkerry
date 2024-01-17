import { ExecuteTriggerOperation, SandBoxCacheType, TriggerHookType, clone, isConnectorTrigger } from '@linkerry/shared'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { ConnectorsMetadataService } from '../../connectors-metadata/connectors-metadata.service'
import { SandboxProvisionerService } from '../../workers/sandbox/sandbox-provisioner.service'

// const generateWorkerToken = ({ projectId }: {}): Promise<string> => {
// 	return accessTokenManager.generateToken({
// 			id: apId(),
// 			type: PrincipalType.WORKER,
// 			projectId,
// 	})
// }
const generateWorkerToken = (): Promise<string> => {
	return new Promise((r) => r('generated_secure_token'))
}

@Injectable()
export class EngineService {
	private readonly logger = new Logger(EngineService.name)

	constructor(
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly sandboxProvisionerService: SandboxProvisionerService,
	) {
		//
	}

	async executeTriggerOperation<T extends TriggerHookType>(operation: Omit<ExecuteTriggerOperation<T>, EngineConstants>) {
		this.logger.debug('[#executeTriggerOperation]', operation.hookType)
		// lock flow version

		const clonedFlowVersion = clone(operation.flowVersion)

		const trigger = clonedFlowVersion.triggers.find((trigger) => trigger.name === operation.triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger`)
		if (!isConnectorTrigger(trigger)) throw new UnprocessableEntityException(`Can not perform operation on non Connector trigger`)

		const { connectorType, connectorName, connectorVersion } = trigger.settings
		const connectorMetadataFixedVersion = (await this.connectorsMetadataService.findOne(connectorName, { version: connectorVersion })).version

		const sandbox = await this.sandboxProvisionerService.provisionSandbox({
			type: SandBoxCacheType.Connector,
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
		this.logger.debug('[#executeTriggerOperation] provised sandbox', sandbox.boxId)

		const input = {
			...operation,
			connectorVersion: connectorMetadataFixedVersion,
			flowVersion: clonedFlowVersion,
			// edition: getEdition(),
			appWebhookUrl: '',
			// appWebhookUrl: await appEventRoutingService.getAppWebhookUrl({
			// 		appName: connectorName,
			// }),
			serverUrl: process.env['SERVER_URL'],
			// webhookSecret: await getWebhookSecret(operation.flowVersion),
			// workerToken: await generateWorkerToken({ projectId: operation.projectId }),
			workerToken: await generateWorkerToken(),
		}

		return {result: 1}

		// return execute(
		// 		EngineOperationType.EXECUTE_TRIGGER_HOOK,
		// 		sandbox,
		// 		input,
		// )
	}
}

type EngineConstants = 'serverUrl' | 'workerToken'
