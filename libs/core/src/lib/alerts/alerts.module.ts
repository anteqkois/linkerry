import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { conditionModelFactory } from '../conditions';
import { EventsService } from '../events/events.service';
import { KafkaModule } from '../kafka';
import { MongodbModule } from '../mongodb';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { MessageProvider } from './message.provider';
import { alertModelFactory } from './schemas/alert.schema';
import { TradingViewController } from './trading-view/trading-view.controller';
import { AlertsProcessor } from './alerts.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    MongooseModule.forFeatureAsync([alertModelFactory, conditionModelFactory]),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        clientId: 'external-alerts-0',
        brokerUrl: configService.get('KAFKA_BROKER_URL') ?? '',
        groupId: configService.get('KAFKA_CONDITION_GROUP_ID') ?? '',
      }),
    }),
  ],
  controllers: [AlertsController, TradingViewController],
  providers: [AlertsService, MessageProvider, EventsService, AlertsProcessor]
})
export class AlertsModule { }
