import { ConditionOperatorType, ConditionTypeType, ICondition } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type ConditionDocument = mongoose.HydratedDocument<Condition>

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Condition implements ICondition {
  _id: string
  type: ConditionTypeType

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: Number })
  requiredValue: number

  @Prop({ required: true, type: String, enum: ConditionOperatorType })
  operator: ConditionOperatorType

  @Prop({ required: true, type: Boolean, default: false })
  active: boolean

  @Prop({ required: false, type: Number, default: 86400 }) // 1 day in seconds
  eventValidityUnix: number

  @Prop({ required: true, type: Boolean, default: false })
  testMode: boolean

  @Prop({ required: true, type: Boolean, default: false })
  isMarketProvider: boolean

  @Prop({ required: true, type: Number, default: 0 })
  triggeredTimes: number
}

export const ConditionSchema = SchemaFactory.createForClass(Condition)
ConditionSchema.index({ user: 1, name: 1 }, { unique: true })

export const conditionModelFactory: AsyncModelFactory = {
  name: Condition.name,
  imports: [],
  useFactory: () => {
    const schema = ConditionSchema
    return schema
  },
  inject: [],
}
