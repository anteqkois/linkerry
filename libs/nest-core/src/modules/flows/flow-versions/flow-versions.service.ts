import {
	Action,
	ActionType,
	FlowState,
	FlowVersionAddActionInput,
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
// import { UpdateTriggerDto } from './dto/update-trigger.dto'
import { FlowVersionModel } from './schemas/flow-version.schema'

@Injectable()
export class FlowVersionsService {
	constructor(@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>) {}

	async createEmpty(flowId: Id, userId: Id) {
		const emptyTrigger = generateEmptyTrigger('trigger_1')

		console.log(emptyTrigger)
		return this.flowVersionModel.create({
			user: userId,
			displayName: 'Untitled',
			state: FlowState.Draft,
			flowId: flowId,
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

	/* STEPS */
	async updateTrigger(id: Id, userId: Id, updateTrigger: Trigger) {
		switch (updateTrigger.type) {
			case TriggerType.CONNECTOR:
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

		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			user: userId,
		})

		if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)
		if (!isTrigger(updateTrigger)) throw new UnprocessableEntityException(`Invalid input, expect trigger receive: ${JSON.stringify(updateTrigger)}`)

		const newFlowVersion = flowHelper.updateTrigger(flowVersion.toObject(), updateTrigger)

		const response = await this.flowVersionModel.updateOne(
			{
				_id: id,
				user: userId,
			},
			{ $set: newFlowVersion },
		)

		if (!response.modifiedCount) throw new UnprocessableEntityException(`Can not find flow version`)
		return newFlowVersion
	}

	// async updateTriggerSettingsInputUiInfo({
	// 	flowVersionId,
	// 	currentSelectedData,
	// 	lastTestDate,
	// 	triggerName,
	// }: {
	// 	flowVersionId: Id
	// 	currentSelectedData: any
	// 	lastTestDate: string
	// 	triggerName: string
	// }) {
	// 	const flowVersion = await this.flowVersionModel.findById(flowVersionId)
	// 	assertNotNullOrUndefined(flowVersion, 'flowVersion')
	// 	flowVersion.triggers = flowVersion.triggers.map((trigger) => {
	// 		if (trigger.name !== triggerName) return trigger
	// 		if (trigger.type !== TriggerType.CONNECTOR) return trigger
	// 		trigger.settings = {
	// 			...trigger.settings,
	// 			inputUiInfo: {
	// 				...trigger.settings.inputUiInfo.customizedInputs,
	// 				currentSelectedData,
	// 				lastTestDate,
	// 			},
	// 		}
	// 		return trigger
	// 	})

	// 	await this.flowVersionModel.updateOne(
	// 		{
	// 			_id: flowVersionId,
	// 		},
	// 		{ $set: flowVersion },
	// 	)
	// }
	async patchTrigger({ flowVersionId, triggerName, trigger }: { flowVersionId: Id; triggerName: string; trigger: Partial<Trigger> }) {
		const flowVersion = await this.flowVersionModel.findById(flowVersionId)
		assertNotNullOrUndefined(flowVersion, 'flowVersion')
		const newFlowVersion = flowHelper.patchTrigger(flowVersion, triggerName, trigger)

		await this.flowVersionModel.updateOne(
			{
				_id: flowVersionId,
			},
			{ $set: newFlowVersion },
		)
	}

	async updateAction(id: Id, userId: Id, updateAction: Action) {
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
			user: userId,
		})

		assertNotNullOrUndefined(flowVersion, 'flowVersion')
		const newFlowVersion = flowHelper.updateAction(flowVersion.toObject(), updateAction)

		const response = await this.flowVersionModel.updateOne(
			{
				_id: id,
				user: userId,
			},
			{ $set: newFlowVersion },
		)

		if (!response.modifiedCount) throw new UnprocessableEntityException(`Can not find flow version`)
		return newFlowVersion
	}

	async addAction(id: Id, userId: Id, { action, parentStepName }: FlowVersionAddActionInput) {
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
			user: userId,
		})

		if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)

		const newFlowVersion = flowHelper.addAction(flowVersion.toObject(), parentStepName, action)

		await this.flowVersionModel.updateOne(
			{
				_id: id,
				user: userId,
			},
			{ $set: newFlowVersion },
		)

		return newFlowVersion
	}
}
