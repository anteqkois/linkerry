import { ConditionType } from '@market-connector/types'
import { Id } from '@market-connector/shared'
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateConditionDto } from './dto/create.dto'
import { ConditionTypeGateway } from './gateways'
import { Condition } from './schemas/condition.schema'
import { PatchConditionDto } from './dto/patch.dto'

@Injectable()
export class ConditionsService {
  private conditionTypeGateways: Record<string, ConditionTypeGateway> = {}

  public registerTypeGateway(alertProvider: ConditionType, gateway: ConditionTypeGateway) {
    this.conditionTypeGateways[alertProvider] = gateway
  }

  constructor(@InjectModel(Condition.name) private readonly conditionModel: Model<Condition>) {}

  async createCondition(dto: CreateConditionDto, userId: string) {
    // Unique index not always work, so implement additional guard
    const existingAlert = await this.conditionModel.findOne({ name: dto.name, user: userId })
    if (existingAlert) throw new UnprocessableEntityException(`Condition with this data exists: ${existingAlert.id}`)

    const conditionTypeGateway = this.conditionTypeGateways[dto.type]
    if (!conditionTypeGateway)
      throw new UnprocessableEntityException(`No gateway for given condition type: ${dto.type}`)

    const condition = await conditionTypeGateway.createCondition(dto, userId)

    return condition
  }

  async patch(dto: PatchConditionDto, userId: Id, id: Id) {
    const condition = await this.conditionModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { $set: { ...dto } },
        { new: true },
      )
      .exec()
    if (!condition) throw new NotFoundException(`Can not find condition: ${id}`)
    return condition
  }
}
