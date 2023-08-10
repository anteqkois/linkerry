import { IStrategyBuy, IStrategyBuy_Condition, Id, StrategyBuyType } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type StrategyBuyDocument = mongoose.HydratedDocument<StrategyBuy>

@Schema({ _id: false })
class StrategyBuyCondition implements IStrategyBuy_Condition {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'conditions' })
  readonly id: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'conditions' })
  readonly condition: Id

  @Prop({ required: true, type: Boolean })
  active: boolean
}

const StrategyBuyConditionSchema = SchemaFactory.createForClass(StrategyBuyCondition)

@Schema({ timestamps: true, discriminatorKey: 'type', collection: 'strategies-buy' })
export class StrategyBuy implements IStrategyBuy {
  _id: string
  type: StrategyBuyType

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: false, type: Number, default: 5356800 }) // 2 month
  validityUnix: number

  @Prop({ required: true, type: [StrategyBuyConditionSchema], default: [] })
  conditions: IStrategyBuy_Condition[]

  @Prop({ required: true, type: Number, default: 0 })
  triggeredTimes: number
}

export const StrategyBuySchema = SchemaFactory.createForClass(StrategyBuy)
StrategyBuySchema.index({ user: 1, name: 1 }, { unique: true })

export const StrategyBuyModelFactory: AsyncModelFactory = {
  name: StrategyBuy.name,
  imports: [],
  useFactory: () => {
    const schema = StrategyBuySchema
    return schema
  },
  inject: [],
}
