import { ExchangeCode, IExchange } from '@market-connector/types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { ExchangeGateway } from './gateway'
import { Exchange } from './schemas/exchange.schema'
import { GetManyExchangesQueryDto } from './dto/get-many-exchanges.dto'

export const EXCHANGE_SERVICE_OPTIONS_TOKEN = 'ExchangesServiceOptionsToken'

export interface ExchangesServiceOptions {
  crontimeExchangeStart: string
  crontimeExchangeStep: number
  crontimeMarketStart: string
  crontimeMarketStep: number
  shouldUpdateData: boolean
}

@Injectable()
export class ExchangesService {
  private readonly logger = new Logger(ExchangesService.name)
  private exchangeGateways: Record<string, ExchangeGateway> = {}
  private crontimeExchangePattern: string
  private crontimeExchangeLast = 1
  private crontimeExchangeStep: number
  private crontimeMarketPattern: string
  private crontimeMarketLast = 1
  private crontimeMarketStep: number
  private shouldUpdateData: boolean

  registerTypeGateway(exchange: ExchangeCode, gateway: ExchangeGateway) {
    gateway.onRegister({
      cron: {
        crontimeExchange: this.crontimeExchangePattern.replace('m', String(this.crontimeExchangeLast)),
        crontimeMarket: this.crontimeMarketPattern.replace('m', String(this.crontimeMarketLast)),
        run: this.shouldUpdateData,
      },
    })

    if (this.shouldUpdateData) {
      // Increase Next Cron Jobs Time
      this.crontimeExchangeLast = this.crontimeExchangeLast + this.crontimeExchangeStep
      this.crontimeMarketLast = this.crontimeMarketLast + this.crontimeMarketStep
    }

    this.exchangeGateways[exchange] = gateway
    this.logger.log(`Exchange registered: ${exchange.toUpperCase()}`)
  }

  constructor(
    @Inject(EXCHANGE_SERVICE_OPTIONS_TOKEN) private options: ExchangesServiceOptions,
    @InjectModel(Exchange.name) private readonly exchangeModel: Model<Exchange>,
  ) {
    this.crontimeExchangePattern = options.crontimeExchangeStart
    this.crontimeMarketPattern = options.crontimeMarketStart
    this.crontimeExchangeStep = options.crontimeExchangeStep
    this.crontimeMarketStep = options.crontimeMarketStep
    this.shouldUpdateData = options.shouldUpdateData
  }

  async updateExchange(data: IExchange) {
    return this.exchangeModel.updateOne({ code: data.code }, data, { upsert: true })
  }

  async findOne(filter: FilterQuery<Exchange>) {
    return this.exchangeModel.findOne(filter)
  }

  async findMany(query: GetManyExchangesQueryDto) {
    const { limit, offset, ...filter } = query

    const parsedFilter: FilterQuery<Exchange> = {}

    if (filter.code) {
      parsedFilter.code = filter.code
    }

    if (filter.name) {
      parsedFilter.name = filter.name
    }

    if (filter.symbol) {
      parsedFilter.symbols = filter.symbol
    }

    return this.exchangeModel.find(parsedFilter, {}, { limit: query.limit, skip: query.offset })
  }
}
