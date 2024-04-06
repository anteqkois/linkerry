import {
	CustomError,
	EngineResponseStatus,
	ErrorCode,
	Id,
	WebhookSimulation,
	assertNotNullOrUndefined,
	isNil
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { RedisLockService } from '../../../lib/redis-lock'
import { ApLock } from '../../../lib/redis-lock/types'
import { FlowVersionDocument, FlowVersionModel } from '../../flows/flow-versions/schemas/flow-version.schema'
import { TriggerHooks } from '../../flows/triggers/trigger-hooks/trigger-hooks.service'
import { WebhookSimulationDocument, WebhookSimulationModel } from './schemas/webhook-simulation.schema'

type BaseParams = {
	flowId: Id
	flowVersionId?: Id
	projectId: Id
}

type DeleteParams = BaseParams & {
	parentLock?: ApLock
}

type GetParams = BaseParams
type CreateParams = BaseParams

type AcquireLockParams = {
	flowId: Id
}

/* Side Effects */
type BaseSideEffectsParams = {
	projectId: Id
	flowId: Id
	flowVersionId?: Id
}

type PreCreateParams = BaseSideEffectsParams
type PreDeleteParams = BaseSideEffectsParams

@Injectable()
export class WebhookSimulationService {
	private readonly logger = new Logger(WebhookSimulationService.name)
	constructor(
		@InjectModel(WebhookSimulationModel.name) private readonly webhookSimulationModel: Model<WebhookSimulationModel>,
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly redisLockService: RedisLockService,
		private readonly triggerHooks: TriggerHooks,
	) {}

	/* Side Effects */
	async _preCreateSideEffect({ projectId, flowId }: PreCreateParams): Promise<void> {
		const flowVersion = await this.flowVersionModel.findOne(
			{
				flow: flowId,
				// _id: flowVersionId,
				projectId,
			},
			{},
			{
				sort: {
					createdAt: -1,
				},
			},
		)

		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const response = await this.triggerHooks.enable({
			projectId,
			flowVersion: flowVersion.toObject(),
			simulate: true,
		})

		if (isNil(response) || response.status !== EngineResponseStatus.OK) {
			throw new CustomError(`Can not run hook _preCreateSideEffect webhook simulation`, ErrorCode.ENGINE_OPERATION_FAILURE, {
				flowVersionId: flowVersion._id,
			})
		}
	}

	async _preDeleteSideEffect({ projectId, flowId, flowVersionId }: PreDeleteParams): Promise<void> {
		const flowVersion = await this.flowVersionModel.findOne(
			{
				// _id: flowVersionId,
				flow: flowId,
				projectId,
			},
			{},
			{
				sort: {
					createdAt: -1,
				},
			},
		)
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const response = await this.triggerHooks.disable({
			projectId,
			flowVersion: flowVersion.toObject(),
			simulate: true,
		})

		if (isNil(response) || response.status !== EngineResponseStatus.OK) {
			throw new CustomError(`Can not run hook _preDeleteSideEffect webhook simulation`, ErrorCode.ENGINE_OPERATION_FAILURE, {
				flowVersionId: flowVersion._id,
			})
		}
	}

	async createLock({ flowId }: AcquireLockParams): Promise<ApLock> {
		const key = `${flowId}-webhook-simulation`
		return this.redisLockService.acquireLock({ key, timeout: 5_000 })
	}

	async create(params: CreateParams): Promise<WebhookSimulation> {
		this.logger.debug(params, 'deleteByFlowId', {
			params,
		})

		const { flowId, flowVersionId, projectId } = params

		const lock = await this.createLock({
			flowId,
		})

		try {
			const webhookSimulationExists = await this.webhookSimulationModel.exists({
				flowId,
			})

			if (webhookSimulationExists) {
				await this.delete({
					flowId,
					flowVersionId,
					projectId,
					parentLock: lock,
				})
			}

			// const webhookSimulation: Omit<WebhookSimulation, DatabaseTimestampKeys> = {
			// 	_id: generateId().toString(),
			// 	...params,
			// }

			await this._preCreateSideEffect({
				flowId,
				projectId,
			})

			return await this.webhookSimulationModel.create(params)
		} finally {
			await lock.release()
		}
	}

	async get(params: GetParams): Promise<WebhookSimulation> {
		this.logger.debug('#get', params)
		const { flowId, projectId } = params

		const webhookSimulation = await this.webhookSimulationModel.findOne({
			flowId,
			projectId,
		})

		if (isNil(webhookSimulation)) {
			this.logger.debug('#get not found')
			throw new CustomError(`WebhookSimulation not found`, ErrorCode.ENTITY_NOT_FOUND, {
				flowId,
				projectId,
			})
		}

		return webhookSimulation
	}

	async delete(params: DeleteParams): Promise<void> {
		this.logger.debug('#delete', { params })

		const { flowId, flowVersionId, projectId, parentLock } = params

		let lock: ApLock | null = null

		if (isNil(parentLock)) {
			lock = await this.createLock({
				flowId,
			})
		}

		try {
			const webhookSimulation = await this.get({
				flowId,
				projectId,
			})

			await this._preDeleteSideEffect({
				flowId,
				projectId,
				flowVersionId,
			})

			await this.webhookSimulationModel.deleteOne({
				_id: webhookSimulation._id,
			})
		} finally {
			if (lock) {
				await lock.release()
			}
		}
	}

	async exists(filter: FilterQuery<WebhookSimulationDocument>) {
		return this.webhookSimulationModel.exists(filter)
	}
}
