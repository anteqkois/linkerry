import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { alertModelFactory } from './schemas/alert.schema';
import { conditionModelFactory } from '../conditions';
import { MessageProvider } from './message.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsService } from '../events/events.service';
import { KafkaModule } from '../kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  controllers: [AlertsController],
  providers: [AlertsService, MessageProvider, EventsService]
})
export class AlertsModule { }
