import { ExchangeCode, IMarket, MarketType } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type MarketsDocument = mongoose.HydratedDocument<Market>

@Schema({ timestamps: true })
export class Market implements IMarket {
  _id: string

  @Prop({ required: true, type: String })
  code: string

  @Prop({ required: true, type: String, enum: ExchangeCode })
  exchangeCode: ExchangeCode

  @Prop({ required: true, type: String })
  symbol: string

  @Prop({ required: true, type: String })
  base: string

  @Prop({ required: true, type: String })
  quote: string

  @Prop({ required: true, type: String })
  baseId: string

  @Prop({ required: true, type: String })
  quoteId: string

  @Prop({ required: true, type: Boolean })
  active: boolean

  @Prop({ required: true, type: String, enum: MarketType })
  type: MarketType

  @Prop({ required: true, type: Boolean })
  spot: boolean

  @Prop({ required: true, type: Boolean })
  margin: boolean

  @Prop({ required: true, type: Boolean })
  future: boolean

  @Prop({ required: true, type: Boolean })
  swap: boolean

  @Prop({ required: true, type: Boolean })
  option: boolean
}

export const MarketsSchema = SchemaFactory.createForClass(Market)
MarketsSchema.index({ ExchangeCode: 1, code: 1 }, { unique: true, sparse: true })

export const marketModelFactory: AsyncModelFactory = {
  name: Market.name,
  useFactory: () => {
    const schema = MarketsSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
