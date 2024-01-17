import { FlowState, Id, flowHelper, generateEmptyTrigger, isTrigger } from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateTriggerDto } from './dto/update-trigger.dto'
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
			flow: flowId,
			valid: false,
			stepsCount: 1,
			triggers: [emptyTrigger],
			actions: [],
		})
	}

	// triggers
	async updateTrigger(id: Id, userId: Id, dto: UpdateTriggerDto) {
		const flowVersion = await this.flowVersionModel.findOne({
			_id: id,
			user: userId,
		})

		if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)
		if (!isTrigger(dto)) throw new UnprocessableEntityException(`Invalid input, expect trigger receive: ${JSON.stringify(dto)}`)

		const newFlowVersion = flowHelper.updateTrigger(flowVersion.toObject(), dto)

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
