import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { CcxtProvider } from './ccxt.provider'
import { ExchangesController } from './exchanges.controller'
import { ExchangesService } from './exchanges.service'
import { MarketsModule } from '../markets'
import { exchangeModelFactory } from './schemas/exchange.schema'
import { BinanceGateway } from './gateways/binance.gateway'

@Module({
  imports: [ScheduleModule.forRoot(), MarketsModule, MongooseModule.forFeatureAsync([exchangeModelFactory])],
  controllers: [ExchangesController],
  providers: [ExchangesService, CcxtProvider, BinanceGateway],
})
export class ExchangesModule {}
