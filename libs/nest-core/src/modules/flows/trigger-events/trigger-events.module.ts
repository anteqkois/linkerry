import { Module } from '@nestjs/common'
import { EngineModule } from '../engine/engine.module'
import { FlowsModule } from '../flows'
import { TriggerEventsController } from './trigger-events.controller'
import { TriggerEventsService } from './trigger-events.service'

@Module({
	controllers: [TriggerEventsController],
	imports: [FlowsModule, EngineModule],
	providers: [TriggerEventsService],
})
export class TriggerEventsModule {}
