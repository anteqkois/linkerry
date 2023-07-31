import { ExchangeCode, IMarket } from '@market-connector/types'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { MarketsService } from '../../markets'
import { CcxtProvider } from '../ccxt.provider'
import { ExchangeGateway } from '../gateway'

@Injectable()
export class BinanceGateway implements ExchangeGateway {
  code = ExchangeCode.binance
  private logger = new Logger(BinanceGateway.name)

  constructor(
    private configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly ccxtProvider: CcxtProvider,
    private readonly marketsService: MarketsService,
  ) {
    ccxtProvider.init(this.code)
  }

  async onModuleInit() {
    await this.registerCronJobs()
    this.logger.log(`Exchange initialized ${this.code}`)
  }

  // getDetails(): Promise<IExchange> {

  // }

  // getMarket(): Promise<IMarket> {

  // }

  async getMarkets(): Promise<IMarket[]> {
    return await this.ccxtProvider.getMarkets()
  }

  // TODO separate to external module/provider
  async registerCronJobs() {
    const crontime = this.configService.get('CRON_MARKET_UPDATE')
    const CRON_JOB_NAME = `${this.code}_update_markets`

    const job = new CronJob(crontime, () => {
      this.updateMarket()
    })

    this.schedulerRegistry.addCronJob(CRON_JOB_NAME, job)
    this.logger.log(`Add ${CRON_JOB_NAME}: ${crontime}`)
    job.start()
  }

  async updateMarket() {
    const markets = await this.getMarkets()
    await this.marketsService.upsertMany(markets)

    this.logger.debug(`Markets refresh: ${this.code}, ${markets.length} markets`)
  }
}
