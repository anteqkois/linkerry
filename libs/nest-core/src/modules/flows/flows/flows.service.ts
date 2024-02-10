import { Id } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { generateId } from '../../../lib/mongodb'
import { MongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowDocument, FlowModel } from './schemas/flow.schema'

@Injectable()
export class FlowsService {
	constructor(@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>, private readonly flowVersionService: FlowVersionsService) {}

	async findOne({ filter }: { filter: MongoFilter<FlowDocument> }) {
		return this.flowModel.findOne(filter).populate(['version'])
	}

	async deleteOne(id: Id, userId: Id) {
		await this.flowModel.deleteOne({
			_id: id,
			user: userId,
		})

		await this.flowVersionService.deleteRelatedToFlow(id)
	}

	async createEmpty(userId: Id) {
		const flowId = generateId()
		const emptyFlowVersion = await this.flowVersionService.createEmpty(flowId.toString(), userId)

		return (
			await this.flowModel.create({
				_id: flowId,
				user: userId,
				version: emptyFlowVersion.id,
			})
		).populate(['version'])
	}
}
