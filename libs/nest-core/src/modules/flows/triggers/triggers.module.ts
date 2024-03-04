import { Module } from '@nestjs/common'
import { EngineModule } from '../../engine'
import { WebhooksModule } from '../../webhooks'
import { QueuesModule } from '../../workers/flow-worker/queues/queues.module'
import { ConnectorsMetadataModule } from '../connectors/connectors-metadata'
import { TriggerHooks } from './trigger-hooks/trigger-hooks.service'

@Module({
	imports: [WebhooksModule, EngineModule, QueuesModule, ConnectorsMetadataModule],
	providers: [TriggerHooks],
	exports: [TriggerHooks],
})
export class TriggersModule {}
