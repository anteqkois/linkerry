import { IStrategy, IStrategy_StrategyBuy, Id, StrategyState, StrategyType } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type StrategyDocument = mongoose.HydratedDocument<Strategy>


class StrategyStrategyBuy implements IStrategy_StrategyBuy {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'strategies-buy' })
  readonly id: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'strategies-buy' })
  readonly strategyBuy: Id

  @Prop({ required: true, type: Boolean, default: false })
  active: boolean
}

const StrategyStrategyBuySchema = SchemaFactory.createForClass(StrategyStrategyBuy)

@Schema({ timestamps: true, discriminatorKey: 'type', collection: 'strategies-buy' })
export class Strategy implements IStrategy {
  _id: string
  // @Prop({requiredL: true, type: String, enum: StrategyType})
  type: StrategyType

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: false, type: Number, default: 5356800 }) // 2 month
  validityUnix: number

  @Prop({ required: true, type: String, enum: StrategyState, default: StrategyState.Idle })
  state: StrategyState

  @Prop({ required: true, type: [StrategyStrategyBuySchema], default: [] })
  strategyBuy: IStrategy_StrategyBuy[]

  // @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StrategySells' }], default: [] })
  // strategySell: Id[]

  // @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StrategyExecutions' }], default: [] })
  // strategyExecution: Id[]

  @Prop({ required: true, type: Boolean, default: false })
  active: boolean

  @Prop({ required: true, type: Boolean, default: false })
  testMode: boolean

  @Prop({ required: true, type: Number, default: 0 })
  triggeredTimes: number
}

export const StrategySchema = SchemaFactory.createForClass(Strategy)
StrategySchema.index({ user: 1, name: 1 }, { unique: true })

export const StrategyModelFactory: AsyncModelFactory = {
  name: Strategy.name,
  imports: [],
  useFactory: () => {
    const schema = StrategySchema
    return schema
  },
  inject: [],
}
