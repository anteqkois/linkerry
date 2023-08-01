import { Module, OnModuleInit } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
// import { CcxtProvider } from './ccxt.provider'
import { ExchangesController } from './exchanges.controller'
import { ExchangesService } from './exchanges.service'
import { MarketsModule } from '../markets'
import { exchangeModelFactory } from './schemas/exchange.schema'
import { BinanceGateway } from './gateways/binance.gateway'
import { CronProvider } from '../../lib/cron/cron'
import { ExchangeCode } from '@market-connector/types'

@Module({
  imports: [ScheduleModule.forRoot(), MarketsModule, MongooseModule.forFeatureAsync([exchangeModelFactory])],
  controllers: [ExchangesController],
  providers: [ExchangesService, CronProvider, BinanceGateway],
})
export class ExchangesModule {
  constructor(private readonly exchangesService: ExchangesService, private readonly binanceGateway: BinanceGateway) {
    exchangesService.registerTypeGateway(ExchangeCode.binance, binanceGateway)
  }
}
