import {
	CustomError,
	ErrorCode,
	ExecutioOutputFile,
	ExecutionState,
	ExecutionType,
	FlowRetryStrategy,
	FlowRun,
	FlowRunStatus,
	Id,
	PauseType,
	RunEnvironment,
	RunTerminationReason,
	assertNotNullOrUndefined,
	isNil,
	spreadIfDefined,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { FilesService } from '../../files/files.service'
import { QueuesService } from '../../workers/flow-worker/queues/queues.service'
import { JobType, LATEST_JOB_DATA_SCHEMA_VERSION, RepeatableJobType } from '../../workers/flow-worker/queues/types'
import { FlowVersionDocument, FlowVersionModel } from '../flow-versions/schemas/flow-version.schema'
import { FlowRunWatcherService } from './flow-runs-watcher.service'
import { FlowRunsHooks } from './flow-runs.hooks'
import { FlowRunDocument, FlowRunModel, FlowRunWithStepsDocument } from './schemas/flow-runs.schema'
import { GetOrCreateParams, HookType, PauseParams, RetryParams, SideEffectPauseParams, SideEffectStartParams, StartParams, TestParams } from './types'

type FindOneWithStepsParams = {
	id: Id
	projectId: Id | undefined
}

@Injectable()
export class FlowRunsService {
	private readonly logger = new Logger(FlowRunsService.name)

	constructor(
		@InjectModel(FlowRunModel.name) private readonly flowRunModel: Model<FlowRunDocument>,
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly queuesService: QueuesService,
		private readonly filesService: FilesService,
		private readonly flowRunsHooks: FlowRunsHooks,
		private readonly flowResponseService: FlowRunWatcherService,
	) {}

	private _calculateDelayForResumeJob(resumeDateTimeIsoString: string): number {
		const now = dayjs()
		const resumeDateTime = dayjs(resumeDateTimeIsoString)
		const delayInMilliSeconds = resumeDateTime.diff(now)
		const resumeDateTimeAlreadyPassed = delayInMilliSeconds < 0

		if (resumeDateTimeAlreadyPassed) {
			return 0
		}

		return delayInMilliSeconds
	}

	private async _finishSideEffect({ flowRun }: { flowRun: FlowRun }): Promise<void> {
		await this.flowRunsHooks.onFinish({ projectId: flowRun.projectId, tasks: flowRun.tasks! })
		// TODO implement notifications system
		// await notifications.notifyRun({
		//     flowRun,
		// })
	}

	private async _startSideEffect({ flowRun, executionType, payload, synchronousHandlerId, hookType }: SideEffectStartParams): Promise<void> {
		this.logger.debug(`#_startSideEffect`, {
			executionType,
			id: flowRun._id,
		})

		this.queuesService.addToQueue({
			id: flowRun._id.toString(),
			type: JobType.ONE_TIME,
			priority: isNil(synchronousHandlerId) ? 'medium' : 'high',
			data: {
				synchronousHandlerId,
				projectId: flowRun.projectId.toString(),
				environment: flowRun.environment,
				runId: flowRun._id.toString(),
				flowVersionId: flowRun.flowVersionId,
				payload,
				executionType,
				hookType,
			},
		})
	}

	private async _pauseSideEffect({ flowRun }: SideEffectPauseParams) {
		this.logger.debug(`#pauseSideEffect`, { id: flowRun._id, pauseType: flowRun.pauseMetadata?.type })

		const { pauseMetadata } = flowRun

		if (isNil(pauseMetadata))
			throw new CustomError(`pauseMetadata is undefined`, ErrorCode.VALIDATION, {
				flowRun,
			})
		switch (pauseMetadata.type) {
			case PauseType.DELAY:
				this.queuesService.addToQueue({
					id: flowRun._id,
					type: JobType.DELAYED,
					data: {
						schemaVersion: LATEST_JOB_DATA_SCHEMA_VERSION,
						runId: flowRun._id,
						projectId: flowRun.projectId,
						environment: flowRun.environment,
						jobType: RepeatableJobType.DELAYED_FLOW,
						flowVersionId: flowRun.flowVersionId,
					},
					delay: this._calculateDelayForResumeJob(pauseMetadata.resumeDateTime),
				})
				break
			case PauseType.WEBHOOK:
				break
		}
	}

	private async _addToQueueReasume({
		flowRunId,
		payload,
		executionType,
	}: {
		flowRunId: Id
		payload: Record<string, unknown>
		executionType: ExecutionType
	}): Promise<void> {
		this.logger.debug(`#_addToQueueReasume`, flowRunId)

		const flowRunToResume = await this.flowRunModel.findOne({
			_id: flowRunId,
		})

		if (isNil(flowRunToResume))
			throw new CustomError(`Can not find flow run`, ErrorCode.FLOW_RUN_NOT_FOUND, {
				id: flowRunId,
			})

		await this.start({
			payload,
			flowRunId: flowRunToResume.id,
			projectId: flowRunToResume.projectId.toString(),
			flowVersionId: flowRunToResume.flowVersionId,
			executionType,
			environment: RunEnvironment.PRODUCTION,
		})
	}

	async findOneWithSteps(params: FindOneWithStepsParams) {
		const flowRun = await this.flowRunModel.findOne<FlowRunWithStepsDocument>({
			_id: params.id,
			projectId: params.projectId,
		})
		assertNotNullOrUndefined(flowRun, 'flowRun')
		let steps: ExecutionState['steps'] = {}

		if (!isNil(flowRun.logsFileId)) {
			const logFile = await this.filesService.findOne({
				fileId: flowRun.logsFileId.toString(),
				projectId: flowRun.projectId.toString(),
			})

			const serializedFlowRunResponse = logFile.data.toString('utf-8')
			const FlowRunResponse: ExecutioOutputFile = JSON.parse(serializedFlowRunResponse)
			steps = FlowRunResponse.executionState.steps
		}
		return {
			...flowRun,
			steps,
		}
	}

	async getFlowRunOrCreate(params: GetOrCreateParams): Promise<FlowRun> {
		const { id, projectId, flowId, flowVersionId, flowDisplayName, environment } = params

		if (id) {
			const flowRun = await this.flowRunModel.findOne({
				_id: id,
				projectId,
			})
			assertNotNullOrUndefined(flowRun, 'flowRun')
			return flowRun.toObject()
		}

		return (
			await this.flowRunModel.create({
				projectId,
				flowId,
				flowVersionId,
				status: FlowRunStatus.RUNNING,
				environment,
				flowDisplayName,
				startTime: new Date().toISOString(),
			})
		).toObject()
	}

	async retry({ flowRunId, strategy }: RetryParams): Promise<void> {
		switch (strategy) {
			case FlowRetryStrategy.FROM_FAILED_STEP:
				await this._addToQueueReasume({
					flowRunId,
					payload: {},
					executionType: ExecutionType.RESUME,
				})
				break
			case FlowRetryStrategy.ON_LATEST_VERSION: {
				throw new CustomError(`Unsuporrted FlowRetryStrategy`, ErrorCode.VALIDATION, { strategy })
				// const flowRun = await this.flowRunModel.findOne({_id: flowRunId})
				// assertNotNullOrUndefined(flowRun, 'flowRun')
				// const flowVersion = await flowVersionService.getLatestLockedVersionOrThrow(flowRun.flowId)
				// await flowRunRepo.update(flowRunId, {
				// 	flowVersionId: flowVersion.id,
				// })

				// await this._addToQueueReasume({
				// 	flowRunId,
				// 	payload: {},
				// 	executionType: ExecutionType.BEGIN,
				// })
				// break
			}
		}
	}

	async start({
		projectId,
		flowVersionId,
		flowRunId,
		payload,
		environment,
		executionType,
		synchronousHandlerId,
		hookType,
	}: StartParams): Promise<FlowRun> {
		this.logger.debug(`#start`, {
			flowRunId,
			executionType,
		})

		const flowVersion = await this.flowVersionModel.findOne({
			_id: flowVersionId,
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		await this.flowRunsHooks.onPreStart({ projectId })

		const flowRun = await this.getFlowRunOrCreate({
			id: flowRunId,
			projectId: flowVersion.projectId.toString(),
			flowId: flowVersion.flow.toString(),
			flowVersionId: flowVersion._id.toString(),
			environment,
			flowDisplayName: flowVersion.displayName,
		})

		await this._startSideEffect({
			flowRun,
			payload,
			synchronousHandlerId,
			executionType,
			hookType,
		})

		return flowRun
	}

	async finish({
		flowRunId,
		status,
		tasks,
		logsFileId,
		tags,
		terminationReason,
	}: {
		flowRunId: Id
		status: FlowRunStatus
		tasks: number
		terminationReason?: RunTerminationReason
		tags: string[]
		logsFileId: Id | null
	}): Promise<FlowRun> {
		this.flowRunModel.updateOne(
			{
				_id: flowRunId,
			},
			{
				...spreadIfDefined('logsFileId', logsFileId),
				status,
				tasks,
				terminationReason,
				tags,
				finishTime: new Date().toISOString(),
			},
		)

		const flowRun: FlowRun | undefined = (await this.flowRunModel.findOne({ _id: flowRunId, projectId: undefined }))?.toObject()
		assertNotNullOrUndefined(flowRun, 'flowRun')

		await this._finishSideEffect({ flowRun })
		return flowRun
	}

	async test({ projectId, flowVersionId }: TestParams): Promise<FlowRun> {
		const flowVersion = await this.flowVersionModel.findOne({ filter: { _id: flowVersionId } })
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const payload = flowVersion.triggers[0].settings.inputUiInfo.currentSelectedData

		return this.start({
			projectId,
			flowVersionId,
			payload,
			environment: RunEnvironment.TESTING,
			executionType: ExecutionType.BEGIN,
			synchronousHandlerId: this.flowResponseService.getHandlerId(),
			hookType: HookType.AFTER_LOG,
		})
	}

	async pause(params: PauseParams): Promise<void> {
		this.logger.debug(`#paus`, { id: params.flowRunId, pauseType: params.pauseMetadata.type })

		const { flowRunId, logFileId, pauseMetadata } = params

		await this.flowRunModel.updateOne(
			{
				_id: flowRunId,
			},
			{
				status: FlowRunStatus.PAUSED,
				logsFileId: logFileId,
				pauseMetadata,
			},
		)

		const flowRun: FlowRun | undefined = (await this.flowRunModel.findOne({ _id: flowRunId }))?.toObject()
		assertNotNullOrUndefined(flowRun, 'flowRun')

		await this._pauseSideEffect({ flowRun })
	}
}
