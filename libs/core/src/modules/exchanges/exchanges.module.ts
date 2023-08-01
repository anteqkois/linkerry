import { DynamicModule, Module, OnModuleInit } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { ExchangesController } from './exchanges.controller'
import { EXCHANGE_SERVICE_OPTIONS_TOKEN, ExchangesService, ExchangesServiceOptions } from './exchanges.service'
import { MarketsModule } from '../markets'
import { exchangeModelFactory } from './schemas/exchange.schema'
import { BinanceGateway } from './gateways/binance.gateway'
import { CronProvider } from '../../lib/cron/cron'

interface ExchangesModuleOptions extends ExchangesServiceOptions {}

@Module({})
export class ExchangesModule {
  static register(config: ExchangesModuleOptions): DynamicModule {
    return {
      module: ExchangesModule,
      imports: [ScheduleModule.forRoot(), MarketsModule, MongooseModule.forFeatureAsync([exchangeModelFactory])],
      controllers: [ExchangesController],
      providers: [
        {
          provide: EXCHANGE_SERVICE_OPTIONS_TOKEN,
          useValue: {
            ...config,
          } as ExchangesServiceOptions,
        },
        ExchangesService,
        CronProvider,
        BinanceGateway,
      ],
    }
  }

  static registerAsync(options: {
    inject: any[]
    useFactory: (...args: any[]) => Promise<ExchangesModuleOptions>
  }): DynamicModule {
    return {
      module: ExchangesModule,
      imports: [ScheduleModule.forRoot(), MarketsModule, MongooseModule.forFeatureAsync([exchangeModelFactory])],
      controllers: [ExchangesController],
      providers: [
        {
          provide: EXCHANGE_SERVICE_OPTIONS_TOKEN,
          useFactory: async (...args: any[]): Promise<ExchangesServiceOptions> => {
            const config = await options.useFactory(...args)
            return {
              ...config,
            }
          },
          inject: options.inject,
        },
        ExchangesService,
        CronProvider,
        BinanceGateway,
      ],
    }
  }
}
