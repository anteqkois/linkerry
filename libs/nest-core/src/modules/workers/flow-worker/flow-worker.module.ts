import { Module } from '@nestjs/common'
import { FlowRunsModule } from '../../flows/flow-runs'
import { QueueModule } from './queue/queue.module'
import { ScheduleJobProcessor } from './schedule-job.processor'

@Module({
	// imports: [TriggersModule, FlowRunsModule, QueueModule],
	imports: [ FlowRunsModule, QueueModule],
	providers: [ScheduleJobProcessor],
})
export class FlowWorkerModule {}
