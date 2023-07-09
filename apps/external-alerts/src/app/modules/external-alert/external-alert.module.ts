import { Module } from '@nestjs/common';
import { ExternalAlertController } from './external-alert.controller';
import { ExternalAlertService } from './external-alert.service';
import {KafkaModule} from '@market-connector/core'
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ KafkaModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      clientId: 'external-alerts-0',
      brokerUrl: configService.get('KAFKA_CONDITION_BROKER_URL'),
      groupId: configService.get('KAFKA_CONDITION_GROUP_ID'),
    }),
  }),],
  controllers: [ExternalAlertController],
  providers: [ExternalAlertService]
})
export class ExternalAlertModule { }
