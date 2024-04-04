import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { AuthModule } from '../../users/auth'
import { WebhooksUrlsModule } from '../../webhooks/webhook-urls/webhook-urls.module'
import { FlowVersionsModule } from '../flow-versions/flow-versions.module'
import { flowVersionModelFactory } from '../flow-versions/schemas/flow-version.schema'
import { FlowModelFactory } from '../flows/schemas/flow.schema'
import { StepFilesModule } from '../step-files/step-files.module'
import { TriggerEventModelFactory } from './schemas/trigger-events.schema'
import { TriggerEventsWebSocketService } from './trigger-events-websocket.gateway'
import { TriggerEventsController } from './trigger-events.controller'
import { TriggerEventsService } from './trigger-events.service'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([TriggerEventModelFactory, flowVersionModelFactory, FlowModelFactory]),
		AuthModule,
		EngineModule,
		FlowVersionsModule,
		StepFilesModule,
		WebhooksUrlsModule
	],
	controllers: [TriggerEventsController],
	providers: [TriggerEventsService, TriggerEventsWebSocketService],
	exports: [TriggerEventsService],
})
export class TriggerEventsModule {}
