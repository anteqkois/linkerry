// WebhooksUrlsModule
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscriptionsModule } from '../../../billing/subscriptions/subscriptions.module'
import { EngineModule } from '../../../engine/engine.module'
import { WebhooksUrlsModule } from '../../../webhooks/webhook-urls/webhook-urls.module'
import { QueuesModule } from '../../../workers/flow-worker/queues/queues.module'
import { ConnectorsMetadataModule } from '../../connectors/connectors-metadata/connectors-metadata.module'
import { FlowModelFactory } from '../../flows/schemas/flow.schema'
import { TriggerHooks } from './trigger-hooks.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([FlowModelFactory]), WebhooksUrlsModule, EngineModule, QueuesModule, ConnectorsMetadataModule, SubscriptionsModule],
	providers: [TriggerHooks],
	exports: [TriggerHooks],
})
export class TriggerHooksModule {}
