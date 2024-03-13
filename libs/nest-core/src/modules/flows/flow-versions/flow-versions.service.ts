import {
	Action,
	ActionType,
	CustomError,
	ErrorCode,
	FlowVersion,
	FlowVersionAddActionInput,
	FlowVersionState,
	Id,
	Trigger,
	TriggerType,
	actionBranchSchema,
	actionConnectorSchema,
	assertNotNullOrUndefined,
	flowHelper,
	generateEmptyTrigger,
	isTrigger,
	triggerConnectorSchema,
	triggerEmptySchema,
} from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { MongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { WebhookSimulationService } from '../../webhooks/webhook-simulation/webhook-simulation.service'
import { StepFilesService } from '../step-files/step-files.service'
import { FlowVersionDocument, FlowVersionModel } from './schemas/flow-version.schema'

type OnApplyOperationParams = {
	projectId: Id
	flowVersion: FlowVersion
}

type DeleteWebhookSimulationParams = {
	projectId: Id
	flowId: Id
}

@Injectable()
export class FlowVersionsService {
	constructor(
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly webhookSimulationService: WebhookSimulationService,
		private readonly stepFilesService: StepFilesService,
	) {}

	async _deleteWebhookSimulation(params: DeleteWebhookSimulationParams): Promise<void> {
		const { projectId, flowId } = params

		try {
			await this.webhookSimulationService.delete({
				projectId,
				flowId,
			})
		} catch (error: unknown) {
			const notWebhookSimulationNotFoundError = !(error instanceof CustomError && error.code === ErrorCode.ENTITY_NOT_FOUND)
			if (notWebhookSimulationNotFoundError) {
				throw error
			}
		}
	}

	async _preUpdateTriggerSideEffect({ projectId, flowVersion }: OnApplyOperationParams) {
		try {
			await this._deleteWebhookSimulation({
				projectId,
				flowId: flowVersion.flow,
			})
		} catch (e) {
			// Ignore error and continue the operation peacefully
			// exceptionHandler.handle(e)
		}
	}

	private _decorateValidityAndUpdatedBy({ flowVersion, userId }: DecorateValidityUpdatedByParams) {
		flowVersion.updatedBy = userId
		flowVersion.valid = flowHelper.isValid(flowVersion)
		return flowVersion
	}

	// TODO handle removeSecrets parameter
	async findOne({ filter }: { filter: MongoFilter<FlowVersionDocument> }) {
		return await this.flowVersionModel.findOne(
			filter,
			{},
			{
				sort: {
					createdAt: -1,
				},
			},
		)
	}

	async createEmpty(flowId: Id, projectId: Id, userId: Id) {
		const emptyTrigger = generateEmptyTrigger('trigger_1')

		return this.flowVersionModel.create({
			flow: flowId,
			projectId,
			displayName: 'Untitled',
			state: FlowVersionState.DRAFT,
			valid: false,
			stepsCount: 1,
			triggers: [emptyTrigger],
			actions: [],
			updatedBy: userId,
		})
	}

	async deleteRelatedToFlow(flowId: Id) {
		return this.flowVersionModel.deleteMany({
			flowId: flowId,
		})
	}

	async update(id: Id, userId: Id, flowVersion: FlowVersion) {
		flowVersion.updatedBy = userId
		return this.flowVersionModel.updateOne(
			{
				_id: id,
			},
			flowVersion,
		)
	}

	/* STEPS */
	async updateTrigger(id: Id, projectId: Id, userId: Id, updateTrigger: Trigger) {
		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			projectId,
		})

		if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)
		if (!isTrigger(updateTrigger)) throw new UnprocessableEntityException(`Invalid input, expect trigger receive: ${JSON.stringify(updateTrigger)}`)

		switch (updateTrigger.type) {
			case TriggerType.CONNECTOR:
				triggerConnectorSchema.parse(updateTrigger)
				break
			case TriggerType.EMPTY:
				triggerEmptySchema.parse(updateTrigger)
				break
			default:
				throw new UnprocessableEntityException(`Invalid trigger type`)
		}

		const newFlowVersion = this._decorateValidityAndUpdatedBy({
			flowVersion: flowHelper.updateTrigger(flowVersion.toObject(), updateTrigger),
			userId,
		})

		const response = await this.flowVersionModel.updateOne(
			{
				_id: id,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		if (!response.modifiedCount) throw new UnprocessableEntityException(`Can not find flow version`)
		return newFlowVersion
	}

	async patchTrigger({
		flowVersionId,
		triggerName,
		trigger,
		projectId,
		userId,
	}: {
		flowVersionId: Id
		triggerName: string
		trigger: Partial<Trigger>
		projectId: Id
		userId: Id
	}) {
		const flowVersion = await this.flowVersionModel.findById(flowVersionId)
		assertNotNullOrUndefined(flowVersion, 'flowVersion')
		const newFlowVersion = this._decorateValidityAndUpdatedBy({
			flowVersion: flowHelper.patchTrigger(flowVersion.toObject(), triggerName, trigger),
			userId,
		})

		await this.flowVersionModel.updateOne(
			{
				_id: flowVersionId,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}

	async updateAction(id: Id, projectId: Id, userId: Id, updateAction: Action) {
		switch (updateAction.type) {
			case ActionType.CONNECTOR:
				actionConnectorSchema.parse(updateAction)
				break
			case ActionType.BRANCH:
				actionBranchSchema.parse(updateAction)
				break
			default:
				throw new UnprocessableEntityException(`Invalid trigger type`)
		}

		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			projectId,
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const newFlowVersion = this._decorateValidityAndUpdatedBy({
			flowVersion: flowHelper.updateAction(flowVersion.toObject(), updateAction),
			userId,
		})

		switch (updateAction.type as ActionType) {
			case ActionType.CONNECTOR:
				// eslint-disable-next-line no-case-declarations
				const step = flowHelper.getStep(flowVersion.toObject(), updateAction.name)

				// delete files when changed connector
				if (step !== undefined && step.type === ActionType.CONNECTOR && updateAction.settings.connectorName !== step.settings.connectorName) {
					await this.stepFilesService.deleteAll({
						projectId,
						flowId: flowVersion.flow.toString(),
						stepName: step.name,
					})
				}

				break
			case ActionType.BRANCH:
			case ActionType.LOOP_ON_ITEMS:
			case ActionType.MERGE_BRANCH:
				throw new CustomError(`Not implemented`, ErrorCode.INVALID_TYPE, {
					type: updateAction.type,
				})
		}

		await this.flowVersionModel.updateOne(
			{
				_id: id,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}

	async addAction(id: Id, projectId: Id, userId: Id, { action, parentStepName }: FlowVersionAddActionInput) {
		switch (action.type) {
			case ActionType.CONNECTOR:
				actionConnectorSchema.parse(action)
				break
			case ActionType.BRANCH:
				actionBranchSchema.parse(action)
				break
			default:
				throw new UnprocessableEntityException(`Invalid trigger type`)
		}

		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			projectId,
		})

		if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)

		const newFlowVersion = this._decorateValidityAndUpdatedBy({
			flowVersion: flowHelper.addAction(flowVersion.toObject(), parentStepName, action),
			userId,
		})

		await this.flowVersionModel.updateOne(
			{
				_id: id,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}

	async deleteAction(id: Id, projectId: Id, userId: Id, actionName: string) {
		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			projectId,
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const newFlowVersion = this._decorateValidityAndUpdatedBy({
			flowVersion: flowHelper.deleteAction(flowVersion.toObject(), actionName),
			userId,
		})

		const step = flowHelper.getStep(flowVersion.toObject(), actionName)
		assertNotNullOrUndefined(step, 'step')
		switch (step.type as ActionType) {
			case ActionType.CONNECTOR:
				// delete files when changed connector
				if (step !== undefined && step.type === ActionType.CONNECTOR) {
					await this.stepFilesService.deleteAll({
						projectId,
						flowId: flowVersion.flow.toString(),
						stepName: step.name,
					})
				}

				break
			case ActionType.BRANCH:
			case ActionType.LOOP_ON_ITEMS:
			case ActionType.MERGE_BRANCH:
		}

		await this.flowVersionModel.updateOne(
			{
				_id: id,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}

	async lockFlowVersionIfNotLocked({ flowVersion, projectId, userId, session }: LockFlowVersionIfNotLockedParams) {
		if (flowVersion.state === FlowVersionState.LOCKED) return flowVersion

		return await this.flowVersionModel
			.findOneAndUpdate(
				{
					_id: flowVersion._id,
					projectId,
				},
				{
					state: FlowVersionState.LOCKED,
					updatedBy: userId,
				},
				{
					new: true,
				},
			)
			.session(session)
	}
}

interface DecorateValidityUpdatedByParams {
	flowVersion: FlowVersion
	userId: Id
}

interface LockFlowVersionIfNotLockedParams {
	flowVersion: FlowVersionDocument
	userId: Id
	projectId: Id
	session: mongoose.mongo.ClientSession
}
