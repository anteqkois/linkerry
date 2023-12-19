import { IStrategy, IStrategy_StrategyBuy, StrategyState, StrategyType } from '@market-connector/types'
import { Id } from '@market-connector/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { StrategyBuy } from '../../strategies-buy/schemas/strategy-buy.schema'
import { UserModel } from '../../users'

export type StrategyDocument = mongoose.HydratedDocument<Strategy>

@Schema({ _id: false })
class StrategyStrategyBuy implements IStrategy_StrategyBuy {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: StrategyBuy.name })
  readonly id: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: StrategyBuy.name })
  readonly strategyBuy: Id

  @Prop({ required: true, type: Boolean, default: false })
  active: boolean
}

const StrategyStrategyBuySchema = SchemaFactory.createForClass(StrategyStrategyBuy)

@Schema({ timestamps: true, discriminatorKey: 'type', collection: 'strategies' })
export class Strategy implements IStrategy {
  _id: string
  // @Prop({requiredL: true, type: String, enum: StrategyType})
  type: StrategyType

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserModel.name })
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
