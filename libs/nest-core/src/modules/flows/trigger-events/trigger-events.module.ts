import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { WebhooksUrlsModule } from '../../webhooks/webhook-urls/webhook-urls.module'
import { FlowVersionsModule } from '../flow-versions/flow-versions.module'
import { flowVersionModelFactory } from '../flow-versions/schemas/flow-version.schema'
import { FlowModelFactory } from '../flows/schemas/flow.schema'
import { StepFilesModule } from '../step-files/step-files.module'
import { TriggerEventModelFactory } from './schemas/trigger-events.schema'
import { TriggerEventsController } from './trigger-events.controller'
import { TriggerEventsService } from './trigger-events.service'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([TriggerEventModelFactory, flowVersionModelFactory, FlowModelFactory]),
		EngineModule,
		FlowVersionsModule,
		StepFilesModule,
		WebhooksUrlsModule
	],
	controllers: [TriggerEventsController],
	providers: [TriggerEventsService],
	exports: [TriggerEventsService],
})
export class TriggerEventsModule {}
