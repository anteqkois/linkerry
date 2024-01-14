import { Module } from '@nestjs/common'
import { TriggerEventsService } from './trigger-events.service'
import { TriggerEventsController } from './trigger-events.controller'
import { FlowsModule } from '../flows'

@Module({
	controllers: [TriggerEventsController],
	imports: [FlowsModule],
	providers: [TriggerEventsService],
})
export class TriggerEventsModule {}
