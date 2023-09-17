import { FlowState, Id } from '@market-connector/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FlowVersionModel } from './schemas/flow-version.schema'

@Injectable()
export class FlowVersionsService {
  constructor(@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>) {}

  async createEmpty(flowId: Id) {
    return this.flowVersionModel.create({
      displayName: 'Untitled',
      state: FlowState.Draft,
      triggers: [{ displayName: 'Select Trigger', name: 'trigger_one', valid: false }],
      flow: flowId,
    })
  }
}
