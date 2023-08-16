import {
  IStrategy,
  IStrategy_GetQuery,
  IStrategy_StrategyBuy,
  Id,
} from '@market-connector/types'
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StrategiesBuyService } from '../strategies-buy'
import {
  CreateStrategyDto,
  PatchStrategyStaticMarketDto,
  StrategyStrategyBuyStaticMarketDto,
  UpdateStrategyStaticMarketDto,
} from './dto'
import { GetOneStrategyQueryDto } from './dto/get.dto'
import { CreateStrategyStrategyBuyDto } from './dto/strategies-buy/create.dto'
import { PatchStrategyStrategyBuyDto } from './dto/strategies-buy/patch.dto'
import { UpdateStrategyDto } from './dto/update.dto'
import { StrategyStaticMarket } from './schemas/strategy-buy-static-market.schema'

@Injectable()
export class StrategiesService {
  async #safeUpdateOne(dto: Partial<UpdateStrategyStaticMarketDto>, userId: Id, id: Id) {
    let parsedStrategyBuy: IStrategy_StrategyBuy[] = []
    if (dto.strategyBuy) parsedStrategyBuy = await this.#safeStrategyBuyParse(dto.strategyBuy, userId)

    delete dto.strategyBuy

    const strategy = await this.strategyStaticMarketModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { $set: { ...dto }, $push: { strategyBuy: { $each: parsedStrategyBuy } } },
        { new: true },
      )
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
        strategies.push({ active: sb.active, id: newStrategyBuy._id, strategyBuy: newStrategyBuy._id })
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

  async findOne(id: Id, userId: Id, query: GetOneStrategyQueryDto) {
    return this.strategyStaticMarketModel
      .findOne({
        _id: id,
        user: userId,
      })
      .populate(query.expand ? query.expand : [])
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
    return this.#safeUpdateOne(dto, userId, id)
  }

  async patch(dto: PatchStrategyStaticMarketDto, userId: Id, id: Id) {
    return this.#safeUpdateOne(dto, userId, id)
  }

  async createStrategyBuy(dto: CreateStrategyStrategyBuyDto, userId: Id, id: Id) {
    const strategyBuy = await this.#safeStrategyBuyParse(
      [
        {
          active: dto.active,
          strategyBuyCreateInput: dto,
        },
      ],
      userId,
    )

    const strategy = await this.strategyStaticMarketModel
      .findOneAndUpdate({ _id: id, user: userId }, { $push: { strategyBuy: strategyBuy[0] } }, { new: true })
      .populate(['strategyBuy.strategyBuy'])
      .exec()
    if (!strategy) throw new NotFoundException('Can not find strategy')

    return strategy.strategyBuy.find((sb) => sb.id?.toString() === strategyBuy[0].id?.toString())
  }

  async patchStrategyBuy(
    dto: PatchStrategyStrategyBuyDto,
    userId: Id,
    id: Id,
    strategyBuyId: Id,
  ) {
    const { active, ...restDto } = dto

    // Update strategy buy
    const strategyBuy = await this.strategiesBuyService.patch(restDto, userId, strategyBuyId)

    // Update strategy
    const strategy = await this.strategyStaticMarketModel
      .findOneAndUpdate(
        {
          _id: id,
          user: userId,
          'strategyBuy.id': strategyBuyId,
        },
        {
          $set: {
            'strategyBuy.$.active': active,
          },
        },
        { new: true },
      )
      .populate(['strategyBuy.strategyBuy'])
      .exec()

    if (!strategy) throw new NotFoundException(`Can not found strategy to update: ${id}`)

    return strategy.strategyBuy.find((sb) => sb.id?.toString() === strategyBuy.id?.toString())
  }
}
