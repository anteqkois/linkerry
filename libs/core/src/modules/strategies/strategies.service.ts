import { Id } from '@market-connector/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateStrategyStaticMarketDto, PatchStrategyStaticMarketDto, UpdateStrategyStaticMarketDto } from './dto'
import { StrategyStaticMarket } from './schemas/strategy-buy-static-market.schema'

@Injectable()
export class StrategiesService {
  constructor(
    @InjectModel(StrategyStaticMarket.name) private readonly strategyStaticMarketModel: Model<StrategyStaticMarket>,
  ) {}

  async createStaticMarket(dto: CreateStrategyStaticMarketDto, userId: Id) {
    return this.strategyStaticMarketModel.create({ ...dto, user: userId })
  }

  async #safeUpdateOne(dto: Partial<UpdateStrategyStaticMarketDto>, userId: Id, id: Id) {
    // TODO migrate to logic which will check if every strategy-buy exist in db, and when not, create it
    const strategy = await this.strategyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $set: { ...dto, _id: undefined } }, { new: true })
      .exec()
    if (!strategy) throw new NotFoundException('Can not find strategy')
    return strategy
  }

  async updateStaticMarket(dto: UpdateStrategyStaticMarketDto, userId: Id, id: Id) {
    return this.#safeUpdateOne(dto, userId, id)
  }

  async patchStaticMarket(dto: PatchStrategyStaticMarketDto, userId: Id, id: Id) {
    return this.#safeUpdateOne(dto, userId, id)
  }
}
