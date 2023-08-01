import { ExchangeCode, IMarket } from '@market-connector/types'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MarketsService } from '../../markets'
import { CcxtProvider } from '../ccxt.provider'
import { ExchangeGateway } from '../gateway'
import { CronProvider } from '../../../lib/cron/cron'
import { ExchangesService } from '../exchanges.service'

@Injectable()
export class BinanceGateway implements ExchangeGateway {
  code = ExchangeCode.binance
  private logger = new Logger(BinanceGateway.name)

  constructor(
    private configService: ConfigService,
    private readonly ccxtProvider: CcxtProvider,
    private readonly marketsService: MarketsService,
    private readonly exchangesService: ExchangesService,
    private readonly cronProvider: CronProvider,
  ) {
    ccxtProvider.init(this.code)
  }

  async onModuleInit() {
    await this.registerCronJobs()
    this.logger.log(`Exchange initialized ${this.code}`)
    this.getExchange()
  }

  // getDetails(): Promise<IExchange> {

  // }

  // getMarket(): Promise<IMarket> {

  // }

  async getMarkets(): Promise<IMarket[]> {
    return await this.ccxtProvider.getMarkets()
  }

  getExchange() {
    return this.ccxtProvider.getExchangeInfo()
  }

  async registerCronJobs() {
    // Refresh data
    const crontimeMarket = this.configService.get('CRON_MARKET_UPDATE')
    const CRON_JOB_NAME_MARKET = `${this.code}_update_markets`
    this.cronProvider.registerCronJob(crontimeMarket, CRON_JOB_NAME_MARKET, this.updateMarket.bind(this))

    const crontimeExchange = this.configService.get('CRON_EXCHANGE_UPDATE')
    const CRON_JOB_NAME_EXCHANGE = `${this.code}_update_exchange`
    this.cronProvider.registerCronJob(crontimeExchange, CRON_JOB_NAME_EXCHANGE, this.updateExchange.bind(this))
  }

  async updateMarket() {
    const markets = await this.getMarkets()
    this.marketsService.upsertMany(markets)
    this.logger.debug(`Markets refresh: ${this.code}`)
  }

  async updateExchange() {
    this.exchangesService.updateExchange(await this.ccxtProvider.getExchangeInfo())
    this.logger.debug(`Exchange refresh: ${this.code}`)
  }
}
