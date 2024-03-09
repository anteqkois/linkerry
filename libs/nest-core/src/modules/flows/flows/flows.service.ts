import { FlowPopulated, FlowPublishInput, FlowStatus, FlowVersion, Id, UpdateStatusInput, assertNotNullOrUndefined } from '@linkerry/shared'
import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import mongoose, { Document, Model } from 'mongoose'
import { generateId } from '../../../lib/mongodb'
import { MongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { RedisLockService } from '../../../lib/redis-lock'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowHooks } from './flows.hooks'
import { FlowDocument, FlowModel } from './schemas/flow.schema'

@Injectable()
export class FlowsService {
	private readonly logger = new Logger(FlowsService.name)

	constructor(
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>,
		@InjectConnection() private readonly mongoConnection: mongoose.Connection,
		private readonly flowVersionService: FlowVersionsService,
		private readonly redisLockService: RedisLockService,
		private readonly flowHooks: FlowHooks,
	) {}

	async findOne({ filter }: { filter: MongoFilter<FlowDocument> }): Promise<
		| (Document<unknown, object, FlowPopulated> &
				FlowPopulated &
				Required<{
					_id: string
				}>)
		| null
	> {
		return this.flowModel.findOne(filter).populate(['version'])
	}

	async deleteOne(id: Id, projectId: Id) {
		await this.flowModel.deleteOne({
			_id: id,
			projectId,
		})

		await this.flowVersionService.deleteRelatedToFlow(id)
	}

	async patch({ flowId, update }: { flowId: Id; update: Partial<FlowModel> }) {
		return this.flowModel.updateOne(
			{
				_id: flowId,
			},
			update,
		)
	}

	async createEmpty(projectId: Id, userId: Id) {
		const flowId = generateId()
		const emptyFlowVersion = await this.flowVersionService.createEmpty(flowId.toString(), projectId, userId)

		return (
			await this.flowModel.create({
				_id: flowId,
				projectId,
				version: emptyFlowVersion.id,
			})
		).populate(['version'])
	}

	async publishAndLock(id: Id, projectId: Id, userId: Id, body: FlowPublishInput): Promise<FlowPopulated> {
		const flowToUpdate = await this.flowModel.findOne({
			_id: id,
			projectId,
		})
		assertNotNullOrUndefined(flowToUpdate, 'flowToUpdate')
		const flowVersionToPublish = await this.flowVersionService.findOne({
			filter: {
				_id: body.flowVersionId,
				flow: flowToUpdate?.id,
			},
		})
		assertNotNullOrUndefined(flowVersionToPublish, 'flowVersionToPublish')

		// prevent confict when two users updates the same flowVesion
		if (dayjs(flowVersionToPublish.updatedAt).add(1, 'minutes').isAfter(dayjs()) && flowVersionToPublish.updatedBy !== userId) {
			this.logger.error(`#publish conflict when ${userId} wants to update flowVersion`)
			throw new ConflictException()
		}

		const flowLock = await this.redisLockService.acquireLock({
			key: id,
			timeout: 10000,
		})

		const { scheduleOptions } = await this.flowHooks.preUpdatePublishedVersionId({
			flowToUpdate: flowToUpdate,
			flowVersionToPublish: flowVersionToPublish,
		})

		const session = await this.mongoConnection.startSession()
		session.startTransaction()
		try {
			const lockedFlowVersion = await this.flowVersionService.lockFlowVersionIfNotLocked({
				flowVersion: flowVersionToPublish,
				userId,
				projectId,
				session,
			})
			assertNotNullOrUndefined(lockedFlowVersion, 'lockedFlowVersion')

			const updateFlowResult = await this.flowModel.findOneAndUpdate(
				{
					_id: flowToUpdate._id,
				},
				{
					$set: {
						publishedVersionId: lockedFlowVersion._id,
						status: FlowStatus.ENABLED,
						schedule: scheduleOptions,
					},
				},
				{
					new: true,
				},
			)
			assertNotNullOrUndefined(updateFlowResult, 'updateResult')

			await session.commitTransaction()
			return {
				...updateFlowResult?.toObject(),
				version: lockedFlowVersion,
			}
		} catch (error) {
			await session.abortTransaction()
			throw error
		} finally {
			session.endSession()
			await flowLock.release()
		}
	}

	async changeStatus(id: Id, projectId: Id, { newStatus }: UpdateStatusInput) {
		const flowToUpdate = await this.flowModel.findOne({ _id: id, projectId }).populate('version')
		assertNotNullOrUndefined(flowToUpdate, 'flowToUpdate')

		if (flowToUpdate.status === newStatus) return flowToUpdate

		const { scheduleOptions } = await this.flowHooks.preUpdateStatus({
			flowToUpdate,
			newStatus,
		})

		return this.flowModel
			.findOneAndUpdate(
				{
					_id: flowToUpdate._id,
				},
				{
					$set: {
						status: newStatus,
						schedule: scheduleOptions,
					},
				},
				{
					new: true,
				},
			)
			.populate('version')
	}

	async updatedPublishedVersionId({ id, userId, projectId }: UpdatePublishedVersionIdParams): Promise<FlowPopulated> {
		const flowToUpdate = await this.flowModel.findOne({ id, projectId })
		assertNotNullOrUndefined(flowToUpdate, 'flowToUpdate')

		const flowVersionToPublish = await this.flowVersionService.findOne({
			filter: {
				flowId: id,
				versionId: undefined,
			},
		})
		assertNotNullOrUndefined(flowVersionToPublish, 'flowVersionToPublish')

		const { scheduleOptions } = await this.flowHooks.preUpdatePublishedVersionId({
			flowToUpdate,
			flowVersionToPublish,
		})

		const session = await this.mongoConnection.startSession()
		session.startTransaction()
		try {
			const lockedFlowVersion = await this.flowVersionService.lockFlowVersionIfNotLocked({
				flowVersion: flowVersionToPublish,
				userId,
				projectId,
				session,
			})
			assertNotNullOrUndefined(lockedFlowVersion, 'lockedFlowVersion')

			flowToUpdate.publishedVersionId = lockedFlowVersion._id
			flowToUpdate.status = FlowStatus.ENABLED
			flowToUpdate.schedule = scheduleOptions

			const updatedFlow = await this.flowModel.findOneAndUpdate(
				{
					_id: id,
					projectId,
				},
				{},
				{
					new: true,
				},
			)
			assertNotNullOrUndefined(updatedFlow, 'updatedFlow')

			await session.commitTransaction()
			return {
				...updatedFlow,
				version: lockedFlowVersion,
			}
		} catch (error) {
			await session.abortTransaction()
			throw error
		} finally {
			session.endSession()
		}
	}
}

export interface LockFlowVersionIfNotLockedParams {
	flowVersion: FlowVersion
	userId: Id
	projectId: Id
}

interface UpdatePublishedVersionIdParams {
	id: Id
	userId: Id
	projectId: Id
}
