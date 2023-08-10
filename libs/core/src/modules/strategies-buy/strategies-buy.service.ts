import { Id, StrategyBuyType } from '@market-connector/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateStrategyBuyStaticMarketDto } from './dro/create-strategy-buy-static-market.dto'
import { UpdateStrategyBuyStaticMarketDto } from './dro/update-strategy-buy-static-market.dto'
import { StrategyBuyStaticMarket } from './schemas/strategy-buy-static-market.schema'

@Injectable()
export class StrategiesBuyService {
  constructor(
    @InjectModel(StrategyBuyStaticMarket.name)
    private readonly strategyBuyStaticMarketModel: Model<StrategyBuyStaticMarket>,
  ) {}

  createStaticMarket(dto: CreateStrategyBuyStaticMarketDto, userId: Id) {
    return this.strategyBuyStaticMarketModel.create({ ...dto, user: userId })
  }

  async #safeUpdateOne(dto: Partial<UpdateStrategyBuyStaticMarketDto>, userId: Id, id: Id) {
    // TODO migrate to logic which will check if every condiyion exist in db, and when not, create it
    const strategyBuy = await this.strategyBuyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $set: { ...dto, _id: undefined } }, { new: true })
      .exec()
    if (!strategyBuy) throw new NotFoundException(`Can not find buy strategy: ${id}`)
    return strategyBuy
  }

  async updateStaticMarket(dto: UpdateStrategyBuyStaticMarketDto, userId: Id, id: Id) {
    return this.#safeUpdateOne(dto, userId, id)
  }
}
