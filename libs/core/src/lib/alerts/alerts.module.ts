import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { conditionModelFactory } from '../conditions';
import { EventsService } from '../events/events.service';
import { KafkaModule } from '../kafka';
import { MongodbModule } from '../mongodb';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { Alert, AlertSchema, alertModelFactory } from './schemas/alert.schema';
import { TradingViewController } from './trading-view/trading-view.controller';
import { TradingViewGateway } from './trading-view/trading-view.gateway';
import { AlertTradinView, AlertTradinViewSchema, alertTradinViewModelFactory } from './trading-view/trading-view.schema';

const ALERT_MODELS = [
  {
    name: Alert.name,
    useFactory: () => {
      const schema = AlertSchema;
      schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
      return schema;
    },
    discriminators: [
      {
        name: AlertTradinView.name,
        schema: AlertTradinViewSchema,
        useFactory: () => {
          const schema = AlertTradinViewSchema;
          schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
          return schema;
        },
      },
    ],
  },
];


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    MongooseModule.forFeatureAsync(ALERT_MODELS),
    MongooseModule.forFeatureAsync([conditionModelFactory]),
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
  providers: [AlertsService, TradingViewGateway, EventsService]
})
export class AlertsModule { }

// const ALERT_MODELS = [
//   {
//     name: Alert.name,
//     useFactory: () => {
//       const schema = AlertSchema;
//       schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
//       return schema;
//     },
//     discriminators: [
//       {
//         name: AlertTradinView.name,
//         schema: AlertTradinViewSchema,
//         useFactory: () => {
//           const schema = AlertTradinViewSchema;
//           schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
//           return schema;
//         },
//       },
//     ],
//   },
// ];
