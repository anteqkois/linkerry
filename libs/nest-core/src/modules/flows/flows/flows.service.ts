import {
	Flow,
	FlowOperationRequest,
	FlowOperationType,
	FlowPopulated,
	FlowStatus,
	FlowVersion,
	FlowVersionState,
	Id,
	UpdateStatusInput,
	assertNotNullOrUndefined,
} from '@linkerry/shared'
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
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowDocument>,
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

	async patch({ flowId, update }: { flowId: Id; update: Partial<Flow> }) {
		return this.flowModel.updateOne(
			{
				_id: flowId,
			},
			update,
		)
	}

	async update({ id, userId, projectId, operation }: UpdateParams) {
		const flowLock = await this.redisLockService.acquireLock({
			key: id,
			timeout: 30000,
		})

		try {
			if (operation.type === FlowOperationType.LOCK_AND_PUBLISH) {
				return await this._updatePublishedVersion({
					id,
					userId,
					projectId,
				})
			} else if (operation.type === FlowOperationType.CHANGE_STATUS) {
				return await this._changeStatus({
					id,
					projectId,
					newStatus: operation.request.status,
				})
				// } else if (operation.type === FlowOperationType.CHANGE_FOLDER) {
				// 	await flowRepo().update(id, {
				// 		folderId: operation.request.folderId,
				// 	})
			} else {
				let flowVersion = await this.flowVersionService.findOne({
					filter: {
						_id: operation.flowVersionId,
						flow: id,
					},
				})
				assertNotNullOrUndefined(flowVersion, 'flowVersion')

				if (flowVersion.state === FlowVersionState.LOCKED) {
					this.logger.debug(`#update replace locked version`)
					/* copy flow version and return as a new flow verions */

					const copiedFlowVersion = await this.flowVersionService.copyVersion(flowVersion?._id.toString())
					flowVersion = copiedFlowVersion

					// Duplicate the artifacts from the previous version, otherwise they will be deleted during update operation
					// flowVersion = await flowVersionService.applyOperation({
					// 	userId,
					// 	projectId,
					// 	flowVersion: flowVersion,
					// 	userOperation: {
					// 		type: FlowOperationType.IMPORT_FLOW,
					// 		request: lastVersionWithArtifacts,
					// 	},
					// })
				}

				const updatedFlowVersion = await this.flowVersionService.applyOperation({
					userId,
					projectId,
					flowVersion: flowVersion.toObject(),
					userOperation: operation,
				})

				return this.flowModel
					.findOneAndUpdate(
						{
							_id: id,
							projectId,
						},
						{
							version: updatedFlowVersion._id,
						},
						{
							new: true,
						},
					)
					.populate('version')
			}
		} finally {
			await flowLock?.release()
		}
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

	private async _changeStatus({ newStatus, id, projectId }: UpdateStatusInput) {
		const flowToUpdate = await this.flowModel.findOne<FlowDocument<'version'>>({ _id: id, projectId }).populate('version')
		assertNotNullOrUndefined(flowToUpdate, 'flowToUpdate')

		if (flowToUpdate.status === newStatus) return flowToUpdate

		const { scheduleOptions } = await this.flowHooks.preUpdateStatus({
			flowToUpdate: flowToUpdate.toObject(),
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

	private async _updatePublishedVersion({ id, userId, projectId }: UpdatePublishedVersionIdParams): Promise<FlowPopulated> {
		const flowToUpdate = await this.flowModel.findOne({ id, projectId })
		assertNotNullOrUndefined(flowToUpdate, 'flowToUpdate')

		const flowVersionToPublish = await this.flowVersionService.findOne({
			filter: {
				flow: id,
			},
		})
		assertNotNullOrUndefined(flowVersionToPublish, 'flowVersionToPublish')

		// prevent confict when two users updates the same flowVesion
		if (dayjs(flowVersionToPublish.updatedAt).add(1, 'minutes').isAfter(dayjs()) && flowVersionToPublish.updatedBy.toString() !== userId) {
			this.logger.error(`#publish conflict when ${userId} wants to update flowVersion`)
			throw new ConflictException()
		}

		const { scheduleOptions } = await this.flowHooks.preUpdatePublishedVersionId({
			flowToUpdate: flowToUpdate.toObject(),
			flowVersionToPublish: flowVersionToPublish.toObject(),
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
				...updatedFlow.toObject(),
				version: lockedFlowVersion.toObject(),
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

type UpdateParams = {
	id: Id
	userId: Id
	projectId: Id
	operation: FlowOperationRequest
}
