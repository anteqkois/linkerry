import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { QueuesService } from './queues.service'
import { QUEUES } from './types'

const EIGHT_MINUTES_IN_MILLISECONDS = 8 * 60 * 1000
export const defaultJobOptions: RegisterQueueOptions['defaultJobOptions'] = {
	attempts: 5,
	backoff: {
		type: 'exponential',
		delay: EIGHT_MINUTES_IN_MILLISECONDS,
	},
	removeOnComplete: true,
}

@Module({
	imports: [
		BullModule.registerQueue({
			configKey: QUEUES.CONFIG_KEYS.FLOW,
			name: QUEUES.NAMES.ONE_TIME_JOB_QUEUE,
			defaultJobOptions,
		}),
		BullBoardModule.forFeature({
			name: QUEUES.NAMES.ONE_TIME_JOB_QUEUE,
			adapter: BullMQAdapter,
		}),
		BullModule.registerQueue({
			configKey: QUEUES.CONFIG_KEYS.FLOW,
			name: QUEUES.NAMES.SCHEDULED_JOB_QUEUE,
			defaultJobOptions,
		}),
		BullBoardModule.forFeature({
			name: QUEUES.NAMES.SCHEDULED_JOB_QUEUE,
			adapter: BullMQAdapter,
		}),
	],
	providers: [QueuesService],
	exports: [QueuesService],
})
export class QueuesModule {}
