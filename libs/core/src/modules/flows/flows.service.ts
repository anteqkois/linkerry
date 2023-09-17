import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FlowModel } from './schemas/flow.schema'
import { Model } from 'mongoose'
import { Id } from '@market-connector/shared'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'

@Injectable()
export class FlowsService {
  constructor(@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>, private readonly flowVersionService: FlowVersionsService) {}

  async createEmpty(userId: Id) {
    const flow = await this.flowModel.create({
      user: userId,
    })

    const emptyFlowVersion = await this.flowVersionService.createEmpty(flow.id)

    flow.version = emptyFlowVersion.id
    await flow.save()

    // return populated flow
    flow.version = emptyFlowVersion
    return flow
  }
}
