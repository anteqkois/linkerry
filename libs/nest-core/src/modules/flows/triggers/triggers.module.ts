import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EngineModule } from '../../engine'
import { WebhooksModule } from '../../webhooks'
// import { QueueModule } from '../../workers/flow-worker'
// TODO resolve this issue why i can't import from ../../workers/flow-worker
import { QueueModule } from '../../workers/flow-worker/queue/queue.module'
import { ConnectorsModule } from '../connectors'
import { TriggerHooks } from './trigger-hooks/trigger-hooks.service'

@Module({
	imports: [WebhooksModule, EngineModule, ConfigModule, ConnectorsModule, QueueModule],
	providers: [TriggerHooks],
	exports: [TriggerHooks],
})
export class TriggersModule {}
