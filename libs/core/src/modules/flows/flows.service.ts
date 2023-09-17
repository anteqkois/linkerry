import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FlowModel } from './schemas/flow.schema'
import { Model } from 'mongoose'
import { Id } from '@market-connector/shared'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { generateId } from '../../lib/mongodb'

@Injectable()
export class FlowsService {
  constructor(@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>, private readonly flowVersionService: FlowVersionsService) {}

  async createEmpty(userId: Id) {
    const flowId = generateId()
    const emptyFlowVersion = await this.flowVersionService.createEmpty(flowId.toString())

    return this.flowModel.create({
      _id: flowId,
      user: userId,
      version: emptyFlowVersion.id,
    })
  }
}
