import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { ONE_TIME_JOB_QUEUE, SCHEDULED_JOB_QUEUE } from './types';

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
	imports:[
		BullModule.registerQueue({
			name: ONE_TIME_JOB_QUEUE,
			defaultJobOptions,
		}),
		BullModule.registerQueue({
			name: SCHEDULED_JOB_QUEUE,
			defaultJobOptions,
		}),
	],
  providers: [QueuesService],
  exports: [QueuesService]
})
export class QueuesModule {}
