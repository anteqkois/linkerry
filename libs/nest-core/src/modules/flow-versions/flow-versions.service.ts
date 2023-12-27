import { FlowState, Id, generateEmptyTrigger } from '@market-connector/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { FlowVersionModel } from './schemas/flow-version.schema'

@Injectable()
export class FlowVersionsService {
  constructor(@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>) {}

  async createEmpty(flowId: Id) {
    const emptyTrigger = generateEmptyTrigger(new Types.ObjectId().toString())

    return this.flowVersionModel.create({
      displayName: 'Untitled',
      state: FlowState.Draft,
      flow: flowId,
      valid: false,
      stepsCount: 1,
      triggers: [emptyTrigger],
    })
  }
}
