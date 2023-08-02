import { Injectable } from '@nestjs/common'
import { CreateStrategyBuyStaticMarket } from './dro/create-strategy-buy-static-market.dto'
import { StrategyBuyStaticMarket } from './schemas/strategy-buy-static-market.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Id, StrategyBuy_TypeType } from '@market-connector/types'

@Injectable()
export class StrategiesBuyService {
  constructor(
    @InjectModel(StrategyBuyStaticMarket.name) private readonly  strategyBuyStaticMarketModel: Model<StrategyBuyStaticMarket>,
  ) {}

  createStrategyStaticMarket(dto: CreateStrategyBuyStaticMarket, userId: Id) {

    return this.strategyBuyStaticMarketModel.create({
      active: dto.active,
      conditions: dto.conditions,
      markets: dto.markets,
      name: dto.name,
      strategySell: [],
      testMode: dto.testMode,
      triggeredTimes: 0,
      type: StrategyBuy_TypeType.STATIC_MARKET,
      user: userId,
    })
  }
}
