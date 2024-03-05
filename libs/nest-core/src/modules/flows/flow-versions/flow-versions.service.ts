import {
	Action,
	ActionType,
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
import { FlowVersionModel } from './schemas/flow-version.schema'

@Injectable()
export class FlowVersionsService {
	constructor(@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>) {}

	async findOne({ filter }: { filter: MongoFilter<FlowVersionModel> }): Promise<FlowVersion | undefined> {
		return (await this.flowVersionModel.findOne(filter))?.toObject()
	}

	async createEmpty(flowId: Id, projectId: Id) {
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
		})
	}

	async deleteRelatedToFlow(flowId: Id) {
		return this.flowVersionModel.deleteMany({
			flowId: flowId,
		})
	}

	async update(id: Id, flowVersion: FlowVersion) {
		return this.flowVersionModel.updateOne({
			_id: id,
		}, flowVersion)
	}

	/* STEPS */
	async updateTrigger(id: Id, projectId: Id, updateTrigger: Trigger) {
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
	}: {
		flowVersionId: Id
		triggerName: string
		trigger: Partial<Trigger>
		projectId: Id
	}) {
		const flowVersion = await this.flowVersionModel.findById(flowVersionId)
		assertNotNullOrUndefined(flowVersion, 'flowVersion')
		const newFlowVersion = flowHelper.patchTrigger(flowVersion, triggerName, trigger)

		await this.flowVersionModel.updateOne(
			{
				_id: flowVersionId,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}

	async updateAction(id: Id, projectId: Id, updateAction: Action) {
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

	async addAction(id: Id, projectId: Id, { action, parentStepName }: FlowVersionAddActionInput) {
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

		await this.flowVersionModel.updateOne(
			{
				_id: id,
				projectId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}

	async deleteAction(id: Id, projectId: Id, actionName: string) {
		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			projectId,
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const newFlowVersion = flowHelper.deleteAction(flowVersion.toObject(), actionName)
		newFlowVersion.valid = flowHelper.isValid(newFlowVersion)

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
