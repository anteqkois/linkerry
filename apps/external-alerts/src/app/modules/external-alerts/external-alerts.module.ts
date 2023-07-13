import { KafkaModule } from '@market-connector/core';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalAlertsController } from './external-alerts.controller';
import { ExternalAlertsService } from './external-alerts.service';

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
  controllers: [ExternalAlertsController],
  providers: [ExternalAlertsService]
})
export class ExternalAlertsModule { }
