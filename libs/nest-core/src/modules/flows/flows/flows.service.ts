import { FlowPublishInput, FlowStatus, Id, PopulatedFlow, UpdateStatusInput, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'
import { generateId } from '../../../lib/mongodb'
import { MongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { RedisLockService } from '../../../lib/redis-lock'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowHooks } from './flows.hooks'
import { FlowDocument, FlowModel } from './schemas/flow.schema'

@Injectable()
export class FlowsService {
	constructor(
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>,
		private readonly flowVersionService: FlowVersionsService,
		private readonly redisLockService: RedisLockService,
		private readonly flowHooks: FlowHooks,
	) {}

	// async lockFlowVersionIfNotLocked({}: LockFlowVersionIfNotLockedParams) {}

	async findOne({ filter }: { filter: MongoFilter<FlowDocument> }): Promise<
		| (Document<unknown, object, PopulatedFlow> &
				PopulatedFlow &
				Required<{
					_id: string
				}>)
		| null
	> {
		// PopulatedFlow
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

	async createEmpty(projectId: Id) {
		const flowId = generateId()
		const emptyFlowVersion = await this.flowVersionService.createEmpty(flowId.toString(), projectId)

		return (
			await this.flowModel.create({
				_id: flowId,
				projectId,
				version: emptyFlowVersion.id,
			})
		).populate(['version'])
	}

	async publish(id: Id, projectId: Id, body: FlowPublishInput): Promise<PopulatedFlow> {
		// // BEGIN EE
		// const currentTime = dayjs()
		// const userId = await extractUserIdFromPrincipal(request.principal)

		// if (!isNil(flow.version.updatedBy) && flow.version.updatedBy !== userId && currentTime.diff(dayjs(flow.version.updated), 'minute') <= 1) {
		// 	return reply.status(StatusCodes.CONFLICT).send()
		// }
		// // END EE
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

		const flowLock = await this.redisLockService.acquireLock({
			key: id,
			timeout: 10000,
		})

		const { scheduleOptions } = await this.flowHooks.preUpdatePublishedVersionId({
			flowToUpdate: flowToUpdate,
			flowVersionToPublish: flowVersionToPublish,
		})

		try {
			// TODO use db transaction
			// TODO lock flows
			// const lockedFlowVersion = await this.lockFlowVersionIfNotLocked({
			// 	flowVersion: flowVersionToPublish,
			// 	userId,
			// 	projectId,
			// })

			const updateFlowResult = await this.flowModel.findOneAndUpdate(
				{
					_id: flowToUpdate._id,
				},
				{
					$set: {
						publishedVersionId: flowVersionToPublish._id,
						status: FlowStatus.ENABLED,
						schedule: scheduleOptions,
					},
				},
				{
					new: true,
				},
			)
			assertNotNullOrUndefined(updateFlowResult, 'updateResult')

			return {
				...updateFlowResult?.toObject(),
				// version: lockedFlowVersion
				version: flowVersionToPublish,
			}
		} finally {
			await flowLock?.release()
		}
	}

	async changeStatus(id: Id, projectId: Id, { newStatus }: UpdateStatusInput) {
		const flowToUpdate = await this.flowModel.findOne({ _id: id, projectId })
		assertNotNullOrUndefined(flowToUpdate, 'flowToUpdate')

		if (flowToUpdate.status === newStatus) return flowToUpdate

		const { scheduleOptions } = await this.flowHooks.preUpdateStatus({
			flowToUpdate,
			newStatus,
		})

		await this.flowModel.findOneAndUpdate(
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

		return this.findOne({
			filter: {
				_id: id,
			},
		})
	}
}
