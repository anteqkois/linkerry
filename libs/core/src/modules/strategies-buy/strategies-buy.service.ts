import { IStrategyBuy_Condition, Id } from '@market-connector/types'
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StrategyBuyStaticMarket } from './schemas/strategy-buy-static-market.schema'
import { UpdateStrategyBuyDto } from './dro/update.dto'
import { CreateStrategyBuyDto, StrategyBuyConditionDto } from './dro/create.dto'
import { ConditionsService } from '../conditions/conditions.service'

@Injectable()
export class StrategiesBuyService {
  async #safeUpdateOne(dto: Partial<UpdateStrategyBuyDto>, userId: Id, id: Id) {
    const strategyBuy = await this.strategyBuyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $set: { ...dto, _id: undefined } }, { new: true })
      .exec()
    if (!strategyBuy) throw new NotFoundException(`Can not find buy strategy: ${id}`)
    return strategyBuy
  }

  async #safeConditionParse(conditions: StrategyBuyConditionDto[], userId: Id) {
    const parsedConditions: IStrategyBuy_Condition[] = []
    for (const c of conditions) {
      if (c.id) {
        parsedConditions.push(c)
        continue
      }
      if (c.conditionCreateInput) {
        const newCondition = await this.conditionsService.createCondition(c.conditionCreateInput, userId)
        parsedConditions.push({ active: c.active, condition: newCondition._id, id: newCondition._id })
        continue
      }
      throw new UnprocessableEntityException('Invalid Strategy Buy')
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
    if (dto.conditions) dto.conditions = await this.#safeConditionParse(dto.conditions, userId)
    return this.#safeUpdateOne(dto, userId, id)
  }
}
