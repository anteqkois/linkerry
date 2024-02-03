import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { FlowVersionsModule } from '../flow-versions'
import { flowVersionModelFactory } from '../flow-versions/schemas/flow-version.schema'
import { FlowsModule } from '../flows'
import { TriggerEventModelFactory } from './schemas/trigger-events.schema'
import { TriggerEventsController } from './trigger-events.controller'
import { TriggerEventsService } from './trigger-events.service'

@Module({
	controllers: [TriggerEventsController],
	imports: [MongooseModule.forFeatureAsync([TriggerEventModelFactory, flowVersionModelFactory]), FlowsModule, EngineModule, FlowVersionsModule ],
	providers: [TriggerEventsService],
})
export class TriggerEventsModule {}
