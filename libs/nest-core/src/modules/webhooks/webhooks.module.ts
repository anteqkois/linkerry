import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowRunsModule } from '../flows/flow-runs/flow-runs.module'
import { flowVersionModelFactory } from '../flows/flow-versions/schemas/flow-version.schema'
import { FlowModelFactory } from '../flows/flows/schemas/flow.schema'
import { TriggerEventsModule } from '../flows/trigger-events/trigger-events.module'
import { DedupeModule } from '../flows/triggers/dedupe/dedupe.module'
import { TriggerHooksModule } from '../flows/triggers/trigger-hooks/trigger-hooks.module'
import { WebhookSimulationModule } from './webhook-simulation/webhook-simulation.module'
import { WebhooksController } from './webhooks.controller'
import { WebhooksService } from './webhooks.service'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([flowVersionModelFactory, FlowModelFactory]),
		WebhookSimulationModule,
		TriggerEventsModule,
		TriggerHooksModule,
		FlowRunsModule,
		DedupeModule,
	],
	controllers: [WebhooksController],
	providers: [WebhooksService],
	exports: [WebhooksService],
})
export class WebhooksModule {}
