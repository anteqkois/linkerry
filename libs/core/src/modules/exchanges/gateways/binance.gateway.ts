import { ExchangeCode } from '@market-connector/types'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CronProvider } from '../../../lib/cron/cron'
import { MarketsService } from '../../markets'
import { CcxtProvider } from '../ccxt.provider'
import { ExchangesService } from '../exchanges.service'
import { ExchangeGateway } from '../gateway'

@Injectable()
export class BinanceGateway extends CcxtProvider implements ExchangeGateway {
  constructor(
    private configService: ConfigService,
    override readonly marketsService: MarketsService,
    override readonly exchangesService: ExchangesService,
    private readonly cronProvider: CronProvider,
  ) {
    super(ExchangeCode.binance, new Logger(BinanceGateway.name), marketsService, exchangesService)
  }

  async onModuleInit() {
    this.logger.log(`Exchange initialized`)
    // this.loadExchange()

    // Register gateway to be avaible at rest app
    this.exchangesService.registerTypeGateway(ExchangeCode.binance, this)
  }

  async onRegister(crontimeMarket: string, crontimeExchange: string) {
    // Refresh data
    // const crontimeMarket = this.configService.get('CRON_MARKET_UPDATE')
    const CRON_JOB_NAME_MARKET = `${this.exchangeCode}_update_markets`
    this.cronProvider.registerCronJob(crontimeMarket, CRON_JOB_NAME_MARKET, this.updateMarket.bind(this))

    // const crontimeExchange = this.configService.get('CRON_EXCHANGE_UPDATE')
    const CRON_JOB_NAME_EXCHANGE = `${this.exchangeCode}_update_exchange`
    this.cronProvider.registerCronJob(crontimeExchange, CRON_JOB_NAME_EXCHANGE, this.updateExchange.bind(this))
  }
}
