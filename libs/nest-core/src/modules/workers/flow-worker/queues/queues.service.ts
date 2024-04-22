import { CustomError, ErrorCode, Id, isNil } from '@linkerry/shared'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { BaseJobOptions, Queue } from 'bullmq'
import { AddParams, JobType, QUEUES, RemoveParams, RepeatingJobData, UpdatePoolingTriggersCronParams, repeatingJobKey } from './types'

@Injectable()
export class QueuesService {
	private readonly logger = new Logger(QueuesService.name)
	constructor(
		@InjectQueue(QUEUES.NAMES.ONE_TIME_JOB_QUEUE) readonly oneTimeJobQueue: Queue,
		@InjectQueue(QUEUES.NAMES.SCHEDULED_JOB_QUEUE) readonly scheduleJobQueue: Queue,
	) {}

	async _findRepeatableJobKey(id: Id): Promise<string | undefined> {
		const client = await this.scheduleJobQueue.client
		const jobKey = await client.get(repeatingJobKey(id))
		if (isNil(jobKey)) {
			// logger.warn({ jobKey: id }, 'Job key not found in redis, trying to find it in the queue')
			this.logger.warn(`#findRepeatableJobKey job key not found in redis, trying to find it in the queue; jobKey: jobKey=${id}`)
			// TODO: this temporary solution for jobs that doesn't have repeatJobKey in redis, it's also confusing because it search by flowVersionId
			const jobs = await this.scheduleJobQueue.getJobs()
			return jobs.filter((job) => !isNil(job) && !isNil(job.data)).find((f) => f.data.flowVersionId === id)?.repeatJobKey
		}
		return jobKey
	}

	async removeRepeatingJob({ id }: RemoveParams): Promise<void> {
		const client = await this.scheduleJobQueue.client
		const jobKey = await this._findRepeatableJobKey(id)

		if (isNil(jobKey)) {
			/*
					If the trigger activation failed, don't let the function fail, just ignore the action, and log an error
					message indicating that the job with key "${jobKey}" couldn't be found, even though it should exist, and
					proceed to skip the deletion.
			*/
			this.logger.error(`Couldn't find job ${jobKey}, even though It should exists, skipping delete`)
			// exceptionHandler.handle(new Error(`Couldn't find job key for id "${id}"`))
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
		this.logger.debug(`#addToQueue params`, params)

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

			this.logger.debug(`#addToQueue REPEATING:`, {
				repeatJobKey: job.repeatJobKey,
			})

			const client = await this.scheduleJobQueue.client
			await client.set(repeatingJobKey(id), job.repeatJobKey)
		} else if (params.type === JobType.DELAYED) {
			this.logger.debug(`addToQueue DELAYED`, {
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

	async updatePoolingTriggerCrons(payload: UpdatePoolingTriggersCronParams[]): Promise<void> {
		const client = await this.scheduleJobQueue.client

		/* retrive repetable jobs data using raw jobs data */
		const repetableJobRedisKeys = await client.keys(`bull:SCHEDULED_JOB_QUEUE:repeat:*:*`)
		const batch = await client.multi()
		for (const jobRedisKey of repetableJobRedisKeys) {
			batch.hmget(jobRedisKey, 'name', 'data', 'opts', 'rjk')
		}
		const redisResponse = await batch.exec()
		const allIds = payload.map((entry) => entry.flowVersionId)
		const rawRedisJobs = redisResponse
			?.map((rawJob) => {
				/* (rawJob?.[1] as any[])[0] is a name from hash => name is flowVersionId */
				if (allIds.includes((rawJob?.[1] as any[])[0])) {
					/* (rawJob?.[1] as any[])[1] is a data from hash  */
					const valuesArray = rawJob?.[1] as string[]
					return {
						id: valuesArray[0],
						data: JSON.parse(valuesArray[1]),
						opts: JSON.parse(valuesArray[2]),
						key: valuesArray[3],
					}
				}
				return false
			})
			.filter(Boolean) as {
			id: Id
			data: RepeatingJobData
			opts: BaseJobOptions // check if is right interface
			key: string
		}[]

		const repetableJobIdsNotFoind: string[] = []
		for (const updateData of payload) {
			const job = rawRedisJobs.find((job) => job.id === updateData.flowVersionId)

			if (isNil(job)) {
				repetableJobIdsNotFoind.push(updateData.flowVersionId)
			} else {
				/* remove old */
				await this.scheduleJobQueue.removeRepeatableByKey(job.key)
				await client.del(repeatingJobKey(job.id))

				/* add new */
				const newJob = await this.scheduleJobQueue.add(updateData.flowVersionId, job.data, {
					jobId: job.id,
					repeat: {
						pattern: updateData.scheduleOptions.cronExpression,
						tz: job.opts.repeat?.tz,
					},
				})
				if (isNil(newJob.repeatJobKey)) {
					return
				}
				this.logger.debug(`#updatePoolingTriggerCrons addToQueue REPEATING:`, {
					repeatJobKey: newJob.repeatJobKey,
				})
				await client.set(repeatingJobKey(updateData.flowVersionId), newJob.repeatJobKey)
			}
		}
	}
}
