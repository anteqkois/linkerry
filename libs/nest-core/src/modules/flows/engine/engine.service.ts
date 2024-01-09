import { ExecuteTriggerOperation, TriggerHookType, clone, isConnectorTrigger } from '@market-connector/shared';
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { ConnectorsMetadataService } from '../../connectors-metadata/connectors-metadata.service';

@Injectable()
export class EngineService {
	private readonly logger = new Logger(EngineService.name);

	constructor(private readonly connectorsMetadataService: ConnectorsMetadataService){
		//
	}

	async executeTriggerOperation<T extends TriggerHookType>(operation:  Omit<ExecuteTriggerOperation<T>, EngineConstants>){
		this.logger.debug(`Execute operation: ${operation.hookType}`)
		// lock flow version

		const clonedFlowVersion = clone(operation.flowVersion)

		const trigger = clonedFlowVersion.triggers.find(trigger => trigger.name === operation.triggerName)
		if(!trigger) throw new UnprocessableEntityException(`Can not retrive trigger`)
		if(!isConnectorTrigger(trigger)) throw new UnprocessableEntityException(`Can not perform operation on non Connector trigger`)

		const { connectorVisibility, connectorName, connectorVersion } = trigger.settings
		const connectorMetadataVersioned = await this.connectorsMetadataService.findOne(connectorName, {version: connectorVersion})

		



	}
}

type EngineConstants = 'serverUrl' | 'workerToken'
