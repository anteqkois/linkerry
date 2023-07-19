import { AlertsModule, AllExceptionsFilter, KafkaModule, TradingViewController } from '@market-connector/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
// import { MongodbModule } from './common/mongodb/mongodb.module';
// import { ExternalAlertsModule } from './modules/external-alerts/external-alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        clientId: 'external-alerts-0',
        brokerUrl: configService.get('KAFKA_BROKER_URL'),
        groupId: configService.get('KAFKA_CONDITION_GROUP_ID'),
      }),
    }),
    AlertsModule,
    // MongodbModule,
    // ExternalAlertsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },],
})
export class AppModule { }
