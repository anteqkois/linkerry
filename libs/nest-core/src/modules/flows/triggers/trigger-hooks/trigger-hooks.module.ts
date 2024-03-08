// WebhooksUrlModule
import { Module } from '@nestjs/common'
import { EngineModule } from '../../../engine/engine.module';
import { QueuesModule } from '../../../workers/flow-worker/queues/queues.module';
import { ConnectorsMetadataModule } from '../../connectors/connectors-metadata/connectors-metadata.module';
import { TriggerHooks } from './trigger-hooks.service';
import { WebhooksUrlModule } from '../../../webhooks/webhook-urls/webhook-urls.module';

@Module({
	imports: [WebhooksUrlModule, EngineModule, QueuesModule, ConnectorsMetadataModule],
	providers: [TriggerHooks],
	exports: [TriggerHooks],
})
export class TriggerHookssModule {}
