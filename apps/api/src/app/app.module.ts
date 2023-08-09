import { AuthModule, ConditionsModule, CoreModule, ExchangesModule, StrategiesBuyModule, StrategiesModule, UserKeysModule, UsersModule } from '@market-connector/core'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    CoreModule,
    ConditionsModule,
    UsersModule,
    AuthModule,
    UserKeysModule,
    StrategiesModule,
    StrategiesBuyModule,
    ExchangesModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        crontimeExchangeStart: configService.get('CRON_EXCHANGE_UPDATE'),
        crontimeExchangeStep: 1,
        crontimeMarketStart: configService.get('CRON_MARKET_UPDATE'),
        crontimeMarketStep: 1,
        shouldUpdateData: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
