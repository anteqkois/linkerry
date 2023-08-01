import { ExchangeCode } from '@market-connector/types'
import { Injectable, Logger } from '@nestjs/common'
import { CronProvider } from '../../../lib/cron/cron'
import { MarketsService } from '../../markets'
import { CcxtProvider } from '../ccxt.provider'
import { ExchangesService } from '../exchanges.service'
import { ExchangeGateway } from '../gateway'

@Injectable()
export class BinanceGateway extends CcxtProvider implements ExchangeGateway {
  constructor(
    override readonly marketsService: MarketsService,
    override readonly exchangesService: ExchangesService,
    override readonly cronProvider: CronProvider,
  ) {
    super(ExchangeCode.binance, new Logger(BinanceGateway.name), marketsService, exchangesService, cronProvider)
  }

  async onModuleInit() {
    this.logger.log(`Exchange initialized`)
    // Register gateway to be avaible at rest app
    this.exchangesService.registerTypeGateway(ExchangeCode.binance, this)
  }
}
