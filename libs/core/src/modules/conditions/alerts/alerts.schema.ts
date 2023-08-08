import { ICondition } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Condition } from '../schemas/condition.schema'

export type ConditionAlertDocument = mongoose.HydratedDocument<Alert>

@Schema()
export class Alert extends Condition {
  @Prop({ required: false, type: Object })
  alert: ICondition['alert']
}

export const AlertSchema = SchemaFactory.createForClass(Alert)

export const alertModelFactory: AsyncModelFactory = {
  name: Alert.name,
  imports: [],
  useFactory: () => {
    const schema = AlertSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
