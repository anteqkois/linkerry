// WebhooksUrlsModule
import { Module } from '@nestjs/common'
import { SubscriptionsModule } from '../../../billing/subscriptions/subscriptions.module'
import { EngineModule } from '../../../engine/engine.module'
import { WebhooksUrlsModule } from '../../../webhooks/webhook-urls/webhook-urls.module'
import { QueuesModule } from '../../../workers/flow-worker/queues/queues.module'
import { ConnectorsMetadataModule } from '../../connectors/connectors-metadata/connectors-metadata.module'
import { TriggerHooks } from './trigger-hooks.service'

@Module({
	imports: [WebhooksUrlsModule, EngineModule, QueuesModule, ConnectorsMetadataModule, SubscriptionsModule],
	providers: [TriggerHooks],
	exports: [TriggerHooks],
})
export class TriggerHooksModule {}
