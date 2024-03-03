import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { QueueJobsService } from './job.service'
import { ONE_TIME_JOB_QUEUE, SCHEDULED_JOB_QUEUE, defaultJobOptions } from './types'

@Module({
	imports: [
		BullModule.registerQueue({
			name: ONE_TIME_JOB_QUEUE,
			defaultJobOptions,
		}),
		BullModule.registerQueue({
			name: SCHEDULED_JOB_QUEUE,
			defaultJobOptions,
		}),
	],
	providers: [QueueJobsService],
	exports: [QueueJobsService],
})
export class QueueModule {}
