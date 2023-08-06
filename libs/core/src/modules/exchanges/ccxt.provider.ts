import { ExchangeCode, IExchange, IMarket, ITimeFrame, MarketType, TimeFrameCode } from '@market-connector/types'
import ccxt, { Exchange, exchanges } from 'ccxt'
import { MarketsService } from '../markets'
import { Logger } from '@nestjs/common'
import { ExchangesService } from './exchanges.service'
import { ExchangeGateway, IOnRegisterInput } from './gateway'
import { CronProvider } from '../../lib/cron/cron'

// @Injectable()
export class CcxtProvider {
  exchangeCode: keyof typeof exchanges
  restClient: Exchange
  // proClient:any

  public constructor(
    exchange: keyof typeof exchanges,
    readonly logger: Logger,
    readonly marketsService: MarketsService,
    readonly exchangesService: ExchangesService,
    readonly cronProvider: CronProvider,
  ) {
    this.exchangeCode = exchange
    this.restClient = new ccxt[exchange]()
  }

  async loadMarkets(): Promise<IMarket[]> {
    await this.restClient.loadMarkets()
    const markets = await this.restClient.fetchMarkets()
    const parsedMarets: IMarket[] = []

    for (let market of markets) {
      // const parsedMarket = this.restClient.parseMarket(market)
      parsedMarets.push({
        active: market.active ?? true,
        code: market.id,
        exchangeCode: ExchangeCode[this.exchangeCode],
        symbol: market.symbol,
        base: market.base,
        quote: market.quote,
        baseId: market.baseId,
        quoteId: market.quoteId,
        type: (market.type as MarketType) ?? MarketType.spot,
        spot: market.spot ?? false,
        margin: market.margin ?? false,
        future: market.future ?? false,
        swap: market.swap ?? false,
        option: market.option ?? false,
      })
    }

    return parsedMarets
  }

  async loadExchange(): Promise<Omit<IExchange, '_id'>> {
    await this.restClient.loadMarkets()

    const timeFrames: ITimeFrame[] = []

    for (const timeFrame in this.restClient.timeframes) {
      if (Object.prototype.hasOwnProperty.call(this.restClient.timeframes, timeFrame)) {
        const code = TimeFrameCode[timeFrame as TimeFrameCode]

        if (!code) continue
        timeFrames.push({
          code,
          value: this.restClient.timeframes[timeFrame],
        })
      }
    }

    return {
      code: ExchangeCode[this.exchangeCode],
      name: this.restClient.name,
      rateLimit: this.restClient.rateLimit,
      symbols: this.restClient.symbols,
      timeframes: timeFrames,
      timeout: this.restClient.timeout,
      urls: {
        fees: this.restClient.urls.fees,
        logo: this.restClient.urls.logo,
        www: this.restClient.urls.www,
      },
      version: this.restClient.version,
    }
  }

  async getMarkets(filter: {
    code?: ExchangeCode
    symbol?: string
    base?: string
    quote?: string
  }): Promise<IMarket[] | []> {
    return (await this.marketsService.findMany(filter)) ?? []
  }

  async getMarket(filter: {
    code?: ExchangeCode
    symbol?: string
    base?: string
    quote?: string
  }): Promise<IMarket | null> {
    return this.marketsService.findOne(filter)
  }

  getExchange() {
    return this.exchangesService.findOne({ code: this.exchangeCode })
  }

  async updateMarket() {
    const markets = await this.loadMarkets()
    this.marketsService.upsertMany(markets)
    this.logger.debug(`Markets refresh: ${this.exchangeCode}`)
  }

  async updateExchange() {
    this.exchangesService.updateExchange(await this.loadExchange())
    this.logger.debug(`Exchange refresh: ${this.exchangeCode}`)
  }

  async onRegister(config: IOnRegisterInput) {
    // Refresh data crons
    if (config.cron.run) {
      const { crontimeExchange, crontimeMarket } = config.cron
      const CRON_JOB_NAME_MARKET = `${this.exchangeCode}_update_markets`
      this.cronProvider.registerCronJob(crontimeMarket, CRON_JOB_NAME_MARKET, this.updateMarket.bind(this))

      const CRON_JOB_NAME_EXCHANGE = `${this.exchangeCode}_update_exchange`
      this.cronProvider.registerCronJob(crontimeExchange, CRON_JOB_NAME_EXCHANGE, this.updateExchange.bind(this))
    }
  }
}
