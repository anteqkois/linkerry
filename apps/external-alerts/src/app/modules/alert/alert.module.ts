import { KafkaModule } from '@market-connector/core';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';

@Module({
  imports: [KafkaModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      clientId: 'external-alerts-0',
      brokerUrl: configService.get('KAFKA_BROKER_URL'),
      groupId: configService.get('KAFKA_CONDITION_GROUP_ID'),
    }),
  }),
  ],
  controllers: [AlertController],
  providers: [AlertService]
})
export class AlertModule { }
