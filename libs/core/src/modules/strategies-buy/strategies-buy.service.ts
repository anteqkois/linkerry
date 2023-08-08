import { Id, StrategyBuy_TypeType } from '@market-connector/types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateStrategyBuyStaticMarketDto } from './dro/create-strategy-buy-static-market.dto'
import { StrategyBuyStaticMarket } from './schemas/strategy-buy-static-market.schema'

@Injectable()
export class StrategiesBuyService {
  constructor(
    @InjectModel(StrategyBuyStaticMarket.name) private readonly  strategyBuyStaticMarketModel: Model<StrategyBuyStaticMarket>,
  ) {}

  createStrategyStaticMarket(dto: CreateStrategyBuyStaticMarketDto, userId: Id) {

    return this.strategyBuyStaticMarketModel.create({
      conditions: dto.conditions,
      name: dto.name,
      strategySell: [],
      triggeredTimes: 0,
      type: StrategyBuy_TypeType.StrategyBuyStaticMarkets,
      user: userId,
    })
  }
}
