import { Module, forwardRef } from '@nestjs/common'
// import { QueueModule } from '../../workers/flow-worker'
import { EngineModule } from '../../engine'
import { WebhooksModule } from '../../webhooks'
// import { QueueModule } from '../../workers/flow-worker'
import { FlowWorkerModule } from '../../workers/flow-worker'
import { QueuesModule } from '../../workers/flow-worker/queues/queues.module'
import { ConnectorsModule } from '../connectors'
import { TriggerHooks } from './trigger-hooks/trigger-hooks.service'

@Module({
	imports: [WebhooksModule, EngineModule, ConnectorsModule, forwardRef(() => FlowWorkerModule), QueuesModule],
	providers: [TriggerHooks],
	exports: [TriggerHooks],
})
export class TriggersModule {}
