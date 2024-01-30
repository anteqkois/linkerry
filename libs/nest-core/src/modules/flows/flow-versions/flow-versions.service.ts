import {
	FlowState,
	Id,
	Trigger,
	TriggerType,
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

		console.log(emptyTrigger);
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

	// triggers
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
}
