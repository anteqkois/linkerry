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
	triggerWebhookSchema,
} from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { WebhookSimulationService } from '../../webhooks/webhook-simulation/webhook-simulation.service'
import { FlowVersionModel } from './schemas/flow-version.schema'

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
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>,
		private readonly webhookSimulationService: WebhookSimulationService,
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

	// TODO handle removeSecrets parameter
	async findOne({ filter }: { filter: MongoFilter<FlowVersionModel> }): Promise<FlowVersion | undefined> {
		return (
			await this.flowVersionModel.findOne(
				filter,
				{},
				{
					sort: {
						createdAt: -1,
					},
				},
			)
		)?.toObject()
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
			case TriggerType.TRIGGER:
				triggerConnectorSchema.parse(updateTrigger)
				break
			case TriggerType.EMPTY:
				triggerEmptySchema.parse(updateTrigger)
				break
			case TriggerType.WEBHOOK:
				triggerWebhookSchema.parse(updateTrigger)
				break
			default:
				throw new UnprocessableEntityException(`Invalid trigger type`)
		}

		const newFlowVersion = flowHelper.updateTrigger(flowVersion.toObject(), updateTrigger)
		newFlowVersion.valid = flowHelper.isValid(newFlowVersion)
		newFlowVersion.updatedBy = userId

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
		const newFlowVersion = flowHelper.patchTrigger(flowVersion, triggerName, trigger)
		newFlowVersion.valid = flowHelper.isValid(newFlowVersion)
		newFlowVersion.updatedBy = userId

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
			case ActionType.ACTION:
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
		const newFlowVersion = flowHelper.updateAction(flowVersion.toObject(), updateAction)
		newFlowVersion.valid = flowHelper.isValid(newFlowVersion)
		newFlowVersion.updatedBy = userId

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

	async addAction(id: Id, projectId: Id, userId: Id, { action, parentStepName }: FlowVersionAddActionInput) {
		switch (action.type) {
			case ActionType.ACTION:
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

		const newFlowVersion = flowHelper.addAction(flowVersion.toObject(), parentStepName, action)
		newFlowVersion.valid = flowHelper.isValid(newFlowVersion)
		newFlowVersion.updatedBy = userId

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

		const newFlowVersion = flowHelper.deleteAction(flowVersion.toObject(), actionName)
		newFlowVersion.valid = flowHelper.isValid(newFlowVersion)
		newFlowVersion.updatedBy = userId

		await this.flowVersionModel.updateOne(
			{
				_id: id,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}
}
