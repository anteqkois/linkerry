import { ExchangeCode, IExchange } from '@market-connector/types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { ExchangeGateway } from './gateway'
import { Exchange } from './schemas/exchange.schema'

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
  private logger = new Logger(ExchangesService.name)
  private exchangeGateways: Record<string, ExchangeGateway> = {}
  private crontimeExchangePattern: string
  private crontimeExchangeLast = 1
  private crontimeExchangeStep: number
  private crontimeMarketPattern: string
  private crontimeMarketLast = 1
  private crontimeMarketStep: number
  private shouldUpdateData: boolean

  registerTypeGateway(exchange: ExchangeCode, gateway: ExchangeGateway) {
    if (this.shouldUpdateData) {
      gateway.onRegister(
        this.crontimeExchangePattern.replace('m', String(this.crontimeExchangeLast)),
        this.crontimeMarketPattern.replace('m', String(this.crontimeMarketLast)),
      )

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
    return this.exchangeModel.find(filter)
  }
}
