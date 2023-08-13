import { IStrategy, IStrategy_GetQuery, IStrategy_StrategyBuy, Id } from '@market-connector/types'
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StrategiesBuyService } from '../strategies-buy'
import {
  CreateStrategyDto,
  PatchStrategyStaticMarketDto,
  StrategyStrategyBuyStaticMarketDto,
  UpdateStrategyStaticMarketDto
} from './dto'
import { StrategyStaticMarket } from './schemas/strategy-buy-static-market.schema'
import { UpdateStrategyDto } from './dto/update.dto'

@Injectable()
export class StrategiesService {
  async #safeUpdateOne(dto: Partial<UpdateStrategyStaticMarketDto>, userId: Id, id: Id) {
    if(dto.strategyBuy) dto.strategyBuy = await this.#safeStrategyBuyParse(dto.strategyBuy, userId)

    const strategy = await this.strategyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $set: { ...dto, _id: undefined } }, { new: true })
      .exec()
    if (!strategy) throw new NotFoundException('Can not find strategy')
    return strategy
  }

  async #safeStrategyBuyParse(strategyBuy: StrategyStrategyBuyStaticMarketDto[], userId: Id) {
    const strategies: IStrategy_StrategyBuy[] = []
    for (const sb of strategyBuy) {
      if (sb.id) {
        strategies.push(sb)
        continue
      }
      if (sb.strategyBuyCreateInput) {
        const newStrategyBuy = await this.strategiesBuyService.create(sb.strategyBuyCreateInput, userId)
        strategies.push(newStrategyBuy.toObject())
        continue
      }
      throw new UnprocessableEntityException('Invalid Strategy Buy')
    }
    return strategies
  }

  constructor(
    @InjectModel(StrategyStaticMarket.name) private readonly strategyStaticMarketModel: Model<StrategyStaticMarket>,
    private readonly strategiesBuyService: StrategiesBuyService,
  ) {}

  async findOne(id: Id, userId: Id) {
    return this.strategyStaticMarketModel.findOne({
      _id: id,
      user: userId,
    })
  }

  async findMany(userId: Id, query: IStrategy_GetQuery): Promise<IStrategy[]> {
    const { limit, offset, ...filter } = query
    return this.strategyStaticMarketModel.find({ user: userId }, {}, { limit: query.limit, skip: query.offset })
  }

  async create(dto: CreateStrategyDto, userId: Id) {
    // Check if any strategy buy to create
    dto.strategyBuy = await this.#safeStrategyBuyParse(dto.strategyBuy, userId)

    // TODO gateway to handle many types
    return this.strategyStaticMarketModel.create({ ...dto, user: userId })
  }

  async update(dto: UpdateStrategyDto, userId: Id, id: Id) {
    if(dto.strategyBuy) await this.#safeStrategyBuyParse(dto.strategyBuy, userId)
    return this.#safeUpdateOne(dto, userId, id)
  }

  async patch(dto: PatchStrategyStaticMarketDto, userId: Id, id: Id) {
    if(dto.strategyBuy) await this.#safeStrategyBuyParse(dto.strategyBuy, userId)
    return this.#safeUpdateOne(dto, userId, id)
  }
}
