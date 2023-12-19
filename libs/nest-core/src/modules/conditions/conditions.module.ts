import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from '../../lib/kafka';
import { EventsService } from '../events/events.service';
import { AlertGateway } from './alerts/alerts.gateway';
import { Alert, AlertSchema } from './alerts/alerts.schema';
import { TradingViewGateway } from './alerts/trading-view/trading-view.gateway';
import { ConditionsController } from './conditions.controller';
import { ConditionsService } from './conditions.service';
import { Condition, ConditionSchema } from './schemas/condition.schema';

const CONDITIONS_MODELS = [
  {
    name: Condition.name,
    useFactory: () => {
      const schema = ConditionSchema;
      schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
      return schema;
    },
    discriminators: [
      {
        name: Alert.name,
        schema: AlertSchema,
        useFactory: () => {
          const schema = AlertSchema;
          schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
          return schema;
        },
      },
    ],
  },
];


@Module({
  imports: [
    MongooseModule.forFeatureAsync([...CONDITIONS_MODELS]),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        clientId: 'external-alerts-0',
        brokerUrl: configService.get('KAFKA_BROKER_URL') ?? '',
        groupId: configService.get('KAFKA_CONDITION_GROUP_ID') ?? '',
      }),
    }),
  ],
  controllers: [ConditionsController],
  providers: [ConditionsService, EventsService, AlertGateway, AlertGateway, TradingViewGateway],
  exports:[ConditionsService]
})
export class ConditionsModule {}
