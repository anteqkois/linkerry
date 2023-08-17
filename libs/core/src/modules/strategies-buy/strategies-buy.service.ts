import { IStrategyBuy_Condition, Id } from '@market-connector/types'
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConditionsService } from '../conditions/conditions.service'
import { CreateStrategyBuyDto, StrategyBuyConditionDto } from './dro/create.dto'
import { UpdateStrategyBuyDto } from './dro/update.dto'
import { StrategyBuyStaticMarket } from './schemas/strategy-buy-static-market.schema'
import { PatchStrategytBuyDto } from './dro/patch.dto'
import { CreateStrategyBuyConditionDto } from './dro/conditions/create.dto'
import { PatchStrategyBuyConditionDto } from './dro/conditions/patch.dto'

@Injectable()
export class StrategiesBuyService {
  async #safeUpdateOne(dto: Partial<UpdateStrategyBuyDto>, userId: Id, id: Id) {
    let parsedConditions: IStrategyBuy_Condition[] = []
    if (dto.conditions) parsedConditions = await this.#safeConditionParse(dto.conditions, userId)

    delete dto.conditions

    const strategyBuy = await this.strategyBuyStaticMarketModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { $set: { ...dto }, $push: { conditions: { $each: parsedConditions } } },
        { new: true },
      )
      .exec()
    if (!strategyBuy) throw new NotFoundException(`Can not find buy strategy: ${id}`)
    return strategyBuy
  }

  async #safeConditionParse(conditions: StrategyBuyConditionDto[], userId: Id) {
    const parsedConditions: IStrategyBuy_Condition[] = []
    for await (const c of conditions) {
      if (c.id) {
        parsedConditions.push(c)
        continue
      }
      if (c.conditionCreateInput) {
        const newCondition = await this.conditionsService.createCondition(c.conditionCreateInput, userId)
        parsedConditions.push({ active: c.active, condition: newCondition._id, id: newCondition._id })
        continue
      }
      throw new UnprocessableEntityException('Invalid condition input')
    }
    return parsedConditions
  }

  constructor(
    @InjectModel(StrategyBuyStaticMarket.name)
    private readonly strategyBuyStaticMarketModel: Model<StrategyBuyStaticMarket>,
    private readonly conditionsService: ConditionsService,
  ) {}

  // async create(dto: CreateStrategyBuyStaticMarketDto | CreateStrategyBuyDynamicMarket){
  async create(dto: CreateStrategyBuyDto, userId: Id) {
    // TODO create gateway to handle many types
    if (dto.conditions) dto.conditions = await this.#safeConditionParse(dto.conditions, userId)
    return this.strategyBuyStaticMarketModel.create({ ...dto, user: userId })
  }

  async update(dto: UpdateStrategyBuyDto, userId: Id, id: Id) {
    return this.#safeUpdateOne(dto, userId, id)
  }

  async patch(dto: PatchStrategytBuyDto, userId: Id, id: Id) {
    return this.#safeUpdateOne(dto, userId, id)
  }

  // Conditions
  async createCondition(dto: CreateStrategyBuyConditionDto, userId: Id, id: Id) {
    const conditions = await this.#safeConditionParse(
      [
        {
          active: dto.active,
          conditionCreateInput: dto,
        },
      ],
      userId,
    )

    const strategyBuy = await this.strategyBuyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $push: { conditions: conditions[0] } }, { new: true })
      .populate(['conditions.condition'])
      .exec()
    if (!strategyBuy) throw new NotFoundException('Can not find condition buy')

    return strategyBuy.conditions.find((condition) => condition.id?.toString() === conditions[0].id?.toString())
  }

  async patchCondition(
    dto: PatchStrategyBuyConditionDto,
    userId: Id,
    id: Id,
    conditionId: Id,
  ) {
    const { active, ...restDto } = dto

    // Update condition
    const condition = await this.conditionsService.patch(restDto, userId, conditionId)

    // Update strategy buy
    const strategyBuy = await this.strategyBuyStaticMarketModel
      .findOneAndUpdate(
        {
          _id: id,
          user: userId,
          'conditions.id': conditionId,
        },
        {
          $set: {
            'conditions.$.active': active,
          },
        },
        { new: true },
      )
      .populate(['conditions.condition'])
      .exec()

    if (!strategyBuy) throw new NotFoundException(`Can not found strategy buy to update: ${id}`)

    return strategyBuy.conditions.find((con) => con.id?.toString() === condition._id?.toString())
  }
}
