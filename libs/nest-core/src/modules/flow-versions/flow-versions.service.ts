import { FlowState, Id, TriggerEmpty, TriggerType } from '@market-connector/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FlowVersionModel } from './schemas/flow-version.schema'

@Injectable()
export class FlowVersionsService {
  constructor(@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>) {}

  async createEmpty(flowId: Id) {
    const emptyTrigger: TriggerEmpty = {
      displayName: 'Select trigger',
      name: 'trigger_one',
      type: TriggerType.Empty,
      valid: false,
    }

    return this.flowVersionModel.create({
      displayName: 'Untitled',
      state: FlowState.Draft,
      flow: flowId,
      valid: false,
      triggers: [ emptyTrigger ],
    })
  }
}
