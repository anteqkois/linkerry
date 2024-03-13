import {
	ErrorCode,
	ExecutionType,
	FlowStatus,
	Id,
	RunEnvironment,
	TriggerPayload,
	TriggerType,
	assertNotNullOrUndefined,
	isCustomError,
	isNil,
} from '@linkerry/shared'
import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Job, Queue, UnrecoverableError } from 'bullmq'
import { Model } from 'mongoose'
import { FlowRunsService } from '../../flows/flow-runs/flow-runs.service'
import { FlowVersionDocument, FlowVersionModel } from '../../flows/flow-versions/schemas/flow-version.schema'
import { FlowDocument, FlowModel } from '../../flows/flows/schemas/flow.schema'
import { TriggerHooks } from '../../flows/triggers/trigger-hooks/trigger-hooks.service'
import { QueuesService } from './queues/queues.service'
import { DelayedJobData, QUEUES, RenewWebhookJobData, RepeatableJobType, RepeatingJobData, ScheduledJobData } from './queues/types'

@Processor(QUEUES.NAMES.SCHEDULED_JOB_QUEUE, {
	concurrency: 10,
})
export class ScheduleJobProcessor extends WorkerHost {
	private readonly logger = new Logger(ScheduleJobProcessor.name)

	constructor(
		@InjectQueue(QUEUES.NAMES.SCHEDULED_JOB_QUEUE) readonly scheduleJobQueue: Queue,
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowDocument>,
		private readonly triggerHooks: TriggerHooks,
		private readonly queuesService: QueuesService,
		private readonly flowRunsService: FlowRunsService,
	) {
		super()
	}

	private async _consumeRepeatingJob(data: RepeatingJobData): Promise<void> {
		try {
			// TODO REMOVE AND FIND PERMANENT SOLUTION -> ACTIVEPIECES NOTE
			const flow = await this.flowModel.findOne({
				_id: data.flowId,
				projectId: data.projectId,
			})

			// remove repeating job
			if (isNil(flow) || flow.status !== FlowStatus.ENABLED || flow.publishedVersionId?.toString() !== data.flowVersionId) {
				const flowVersion = await this.flowVersionModel.findOne({
					_id: data.flowVersionId,
				})

				if (isNil(flowVersion)) {
					await this.queuesService.removeRepeatingJob({
						id: data.flowVersionId,
					})
				} else {
					await this.triggerHooks.disable({
						projectId: data.projectId,
						flowVersion:flowVersion.toObject(),
						simulate: false,
						ignoreError: true,
					})
				}

				throw new UnrecoverableError(
					`#_consumeRepeatingJob removing project.id=${data.projectId} instance.flowVersionId=${flow?.publishedVersionId} data.flowVersion.id=${data.flowVersionId}`,
				)
			}

			if (data.triggerType === TriggerType.CONNECTOR) {
				await this._consumeConnectorTrigger(data)
			}
		} catch (error: any) {
			if (isCustomError(error) && error.code === ErrorCode.QUOTA_EXCEEDED) {
				this.logger.debug(`#consumeRepeatingJob removing project._id=${data.projectId} run out of flow quota`)
				await this.flowModel.updateOne(
					{
						_id: data.flowId,
					},
					{
						status: FlowStatus.DISABLED,
					},
				)
			} else throw error
		}
	}

	private async _consumeConnectorTrigger(data: RepeatingJobData): Promise<void> {
		const flowVersion = await this.flowVersionModel.findOne({
			_id: data.flowVersionId,
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const payloads: unknown[] = await this.triggerHooks.executeTrigger({
			projectId: data.projectId,
			flowVersion: flowVersion.toObject(),
			payload: {} as TriggerPayload,
			simulate: false,
		})

		this.logger.debug(`#consumeConnectorTrigger payloads.length=${payloads.length}`, payloads)

		const createFlowRuns = payloads.map((payload) =>
			this.flowRunsService.start({
				environment: RunEnvironment.PRODUCTION,
				flowVersionId: data.flowVersionId,
				payload,
				projectId: data.projectId,
				executionType: ExecutionType.BEGIN,
			}),
		)

		await Promise.all(createFlowRuns)
	}

	private async _consumeDelayedJob(data: DelayedJobData): Promise<void> {
		this.logger.debug(`#_consumeDelayedJob`, { id: data.runId })

		await this.flowRunsService.start({
			payload: null,
			flowRunId: data.runId,
			projectId: data.projectId,
			flowVersionId: data.flowVersionId,
			executionType: ExecutionType.RESUME,
			environment: RunEnvironment.PRODUCTION,
		})
	}

	private async _consumeRenewWebhookJob(data: RenewWebhookJobData): Promise<void> {
		this.logger.debug(`#consumeRenewWebhookJob`, {
			flowVersionId: data.flowVersionId,
		})

		const flowVersion = await this.flowVersionModel.findOne({
			_id: data.flowVersionId,
		})

		assertNotNullOrUndefined(flowVersion, 'flowVersion ')

		await this.triggerHooks.renewWebhook({
			flowVersion: flowVersion.toObject(),
			projectId: data.projectId,
			simulate: false,
		})
	}

	async process(job: Job<ScheduledJobData, unknown, Id>): Promise<any> {
		this.logger.debug(`#process new job`, job.data)
		try {
			switch (job.data.jobType) {
				case RepeatableJobType.EXECUTE_TRIGGER:
					await this._consumeRepeatingJob(job.data)
					break
				case RepeatableJobType.DELAYED_FLOW:
					await this._consumeDelayedJob(job.data)
					break
				case RepeatableJobType.RENEW_WEBHOOK:
					await this._consumeRenewWebhookJob(job.data)
					break
			}
		} catch (error: any) {
			this.logger.error(`#process ${job.data.jobType} error:`)
			this.logger.error(error.stack)
			throw error
			// captureException(e)
		}
	}

	@OnWorkerEvent('completed')
	onCompleted() {
		this.logger.debug(`Cemplete job`)
		// do some stuff
	}
}
