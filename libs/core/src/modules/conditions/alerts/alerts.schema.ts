import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { ConditionTypeType, ICondition } from '@market-connector/types'
import { Condition } from '../schemas/condition.schema'

export type ConditionAlertDocument = mongoose.HydratedDocument<ConditionAlert>

@Schema()
export class ConditionAlert extends Condition {
  @Prop({ required: true, type: String, enum: ConditionTypeType, default: ConditionTypeType.ALERT })
  override readonly type: ConditionTypeType.ALERT

  @Prop({ required: false, type: Object })
  alert: ICondition['alert']
}

export const ConditionAlertSchema = SchemaFactory.createForClass(ConditionAlert)

export const alertModelFactory: AsyncModelFactory = {
  name: ConditionAlert.name,
  imports: [],
  useFactory: () => {
    const schema = ConditionAlertSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
