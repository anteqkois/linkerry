import { CustomError, ErrorCode, isNil } from '@linkerry/shared'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bullmq'
import { AddParams, JobType, ONE_TIME_JOB_QUEUE, RemoveParams, SCHEDULED_JOB_QUEUE, repeatingJobKey } from './types'

@Injectable()
export class QueueJobsService {
	private readonly logger = new Logger()
	constructor(@InjectQueue(ONE_TIME_JOB_QUEUE) readonly oneTimeJobQueue: Queue, @InjectQueue(SCHEDULED_JOB_QUEUE) readonly scheduleJobQueue: Queue) {}

	async removeRepeatingJob({ id }: RemoveParams): Promise<void> {
		const client = await this.scheduleJobQueue.client
		const jobKey = await client.get(repeatingJobKey(id))

		if (jobKey === null) {
			/*
						If the trigger activation failed, don't let the function fail, just ignore the action, and log an error
						message indicating that the job with key "${jobKey}" couldn't be found, even though it should exist, and
						proceed to skip the deletion.
				*/
			this.logger.error(`Couldn't find job ${jobKey}, even though It should exists, skipping delete`)
		} else {
			const result = await this.scheduleJobQueue.removeRepeatableByKey(jobKey)
			await client.del(repeatingJobKey(id))

			if (!result)
				throw new CustomError(`Can not remove repetable key`, ErrorCode.JOB_REMOVAL_FAILURE, {
					jobId: id,
				})
		}
	}

	async addToQueue(params: AddParams<JobType>): Promise<void> {
		this.logger.debug(params, '#addToQueue params')

		if (params.type === JobType.REPEATING) {
			const { id, data, scheduleOptions } = params
			const job = await this.scheduleJobQueue.add(id, data, {
				jobId: id,
				repeat: {
					pattern: scheduleOptions.cronExpression,
					tz: scheduleOptions.timezone,
				},
			})

			if (isNil(job.repeatJobKey)) {
				return
			}

			this.logger.debug(`#addToQueue#REPEATING:`, {
				repeatJobKey: job.repeatJobKey,
			})

			const client = await this.scheduleJobQueue.client
			await client.set(repeatingJobKey(id), job.repeatJobKey)
		} else if (params.type === JobType.DELAYED) {
			this.logger.debug(`addToQueue#DELAYED`, {
				flowRunId: params.id,
				delay: params.delay,
			})

			const { id, data, delay } = params

			await this.scheduleJobQueue.add(id, data, {
				jobId: id,
				delay,
			})
		} else {
			const { id, data } = params

			await this.oneTimeJobQueue.add(id, data, {
				jobId: id,
				priority: params.priority === 'high' ? 1 : 2,
			})
		}
	}
}
