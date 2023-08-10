import { Id, StrategyState, StrategyType } from '@market-connector/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateStrategyStaticMarketDto } from './dto/create-strategy-static-market.dto'
import { StrategyStaticMarket } from './schemas/strategy-buy-static-market.schema'
import { UpdateStrategyStaticMarketDto } from './dto/update-strategy-static-market.dto'

@Injectable()
export class StrategiesService {
  constructor(
    @InjectModel(StrategyStaticMarket.name) private readonly strategyStaticMarketModel: Model<StrategyStaticMarket>,
  ) {}

  async createStaticMarket(dto: CreateStrategyStaticMarketDto, userId: Id) {
    return this.strategyStaticMarketModel.create({...dto, user: userId})
  }

  async updateStaticMarket(dto: UpdateStrategyStaticMarketDto, userId: Id, id: Id) {
    // TODO migrate to logic which will check if every strategy-buy exist in db, and when not, create it
    const strategy = await this.strategyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $set: {...dto, _id: undefined} }, { new: true })
      .exec()
    if (!strategy) throw new NotFoundException('Can not find strategy')
    return strategy
  }

  // async patchStaticMarket(dto: UpdateStrategyStaticMarketDto, userId: Id, id: Id) {
  //   // TODO migrate to logic which will check if every strategy-buy exist in db, and when not, create it
  //   const strategy = await this.strategyStaticMarketModel
  //     .findOneAndUpdate({ _id: id, user: userId }, { $set: dto }, { new: true })
  //     .exec()
  //   if (!strategy) throw new NotFoundException('Can not find strategy')
  //   return strategy
  // }
}
