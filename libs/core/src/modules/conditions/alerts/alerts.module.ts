import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Condition, ConditionSchema } from '../schemas/condition.schema'
import { AlertGateway } from './alerts.gateway'
import { ConditionAlert, ConditionAlertSchema } from './alerts.schema'
import { TradingViewGateway } from './trading-view/trading-view.gateway'

const CONDITIONS_MODELS = [
  {
    name: Condition.name,
    useFactory: () => {
      const schema = ConditionSchema
      schema.plugin(require('mongoose-unique-validator'), {
        message: 'Error, expected {PATH} to be unique. Received {VALUE}',
      })
      return schema
    },
    discriminators: [
      {
        name: ConditionAlert.name,
        schema: ConditionAlertSchema,
        useFactory: () => {
          const schema = ConditionAlertSchema
          schema.plugin(require('mongoose-unique-validator'), {
            message: 'Error, expected {PATH} to be unique. Received {VALUE}',
          })
          return schema
        },
      },
    ],
  },
]

@Module({
  imports: [MongooseModule.forFeatureAsync([...CONDITIONS_MODELS])],
  providers: [AlertGateway, TradingViewGateway],
  exports: [AlertGateway, TradingViewGateway],
})
export class AlertModule {}
