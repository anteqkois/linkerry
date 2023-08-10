import { ConditionType } from '@market-connector/types';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConditionDto } from './dto/create-condition.dto';
import { ConditionTypeGateway } from './gateways';
import { Condition } from './schemas/condition.schema';

@Injectable()
export class ConditionsService {
  private conditionTypeGateways: Record<string, ConditionTypeGateway> = {};

  public registerTypeGateway(
    alertProvider: ConditionType,
    gateway: ConditionTypeGateway,
  ) {
    this.conditionTypeGateways[alertProvider] = gateway;
  }

  constructor(
    @InjectModel(Condition.name) private readonly conditionModel: Model<Condition>,
  ){}

  async createCondition(dto: CreateConditionDto, userId: string) {
    // Unique index not always work, so implement additional guard
    const existingAlert = await this.conditionModel.findOne({name: dto.name, user: userId})
    if(existingAlert) throw new UnprocessableEntityException(`Condition with this data exists: ${ existingAlert.id }`)

    const conditionTypeGateway = this.conditionTypeGateways[dto.type]
    if(!conditionTypeGateway) throw new UnprocessableEntityException(`No gateway for given condition type: ${ dto.type }`)

    const condition = await conditionTypeGateway.createCondition(dto, userId)

    return condition
  }
}
