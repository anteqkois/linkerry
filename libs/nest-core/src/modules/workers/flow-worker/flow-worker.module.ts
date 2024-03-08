import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowRunsModule } from '../../flows/flow-runs/flow-runs.module'
import { FlowVersionsModule } from "../../flows/flow-versions/flow-versions.module"
import { flowVersionModelFactory } from '../../flows/flow-versions/schemas/flow-version.schema'
import { FlowsModule } from '../../flows/flows/flows.module'
import { FlowModelFactory } from '../../flows/flows/schemas/flow.schema'
import { TriggersModule } from '../../flows/triggers/triggers.module'
import { QueuesService } from './queues/queues.service'
import { ONE_TIME_JOB_QUEUE, SCHEDULED_JOB_QUEUE } from './queues/types'
import { ScheduleJobProcessor } from './schedule-job.processor'

const EIGHT_MINUTES_IN_MILLISECONDS = 8 * 60 * 1000
const defaultJobOptions: RegisterQueueOptions['defaultJobOptions'] = {
	attempts: 5,
	backoff: {
		type: 'exponential',
		delay: EIGHT_MINUTES_IN_MILLISECONDS,
	},
	removeOnComplete: true,
}

@Module({
	imports: [
		MongooseModule.forFeatureAsync([flowVersionModelFactory, FlowModelFactory]),
		FlowRunsModule,
		FlowsModule,
		TriggersModule,
		FlowVersionsModule,
		BullModule.registerQueue({
			name: ONE_TIME_JOB_QUEUE,
			defaultJobOptions,
		}),
		BullModule.registerQueue({
			name: SCHEDULED_JOB_QUEUE,
			defaultJobOptions,
		}),
	],
	providers: [ScheduleJobProcessor, QueuesService],
})
export class FlowWorkerModule {}