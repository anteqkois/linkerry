import { Id } from '@market-connector/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { generateId } from '../../lib/mongodb'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowModel } from './schemas/flow.schema'

@Injectable()
export class FlowsService {
  constructor(@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>, private readonly flowVersionService: FlowVersionsService) {}

  async createEmpty(userId: Id) {
    const flowId = generateId()
    const emptyFlowVersion = await this.flowVersionService.createEmpty(flowId.toString())

    return (
      await this.flowModel.create({
        _id: flowId,
        user: userId,
        version: emptyFlowVersion.id,
      })
    ).populate(['version'])
  }
}
