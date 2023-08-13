import { Id } from '@market-connector/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StrategyBuyStaticMarket } from './schemas/strategy-buy-static-market.schema'
import { UpdateStrategyBuyDto } from './dro/update.dto'
import { CreateStrategyBuyDto } from './dro/create.dto'

@Injectable()
export class StrategiesBuyService {
    async #safeUpdateOne(dto: Partial<UpdateStrategyBuyDto>, userId: Id, id: Id) {
      const strategyBuy = await this.strategyBuyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $set: { ...dto, _id: undefined } }, { new: true })
      .exec()
      if (!strategyBuy) throw new NotFoundException(`Can not find buy strategy: ${id}`)
      return strategyBuy
  }

  constructor(
    @InjectModel(StrategyBuyStaticMarket.name)
    private readonly strategyBuyStaticMarketModel: Model<StrategyBuyStaticMarket>,
  ) {}

  // async create(dto: CreateStrategyBuyStaticMarketDto | CreateStrategyBuyDynamicMarket){
  async create(dto: CreateStrategyBuyDto, userId: Id) {
    // TODO create gateway to handle many types
    return this.strategyBuyStaticMarketModel.create({ ...dto, user: userId })
  }

async update(dto: UpdateStrategyBuyDto, userId: Id, id: Id) {
    // TODO migrate to logic which will check if every condition exist in db, and when not, create it (GATEWAY)
    return this.#safeUpdateOne(dto, userId, id)
  }
}
