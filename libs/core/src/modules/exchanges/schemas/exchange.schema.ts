import { ExchangeCode, IExchange, ITimeFrame, TimeFrameCode } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type ExchangesDocument = mongoose.HydratedDocument<Exchange>

class UrlsSchema {
  @Prop({ required: false, type: String })
  logo?: string

  @Prop({ required: false, type: String })
  www?: string

  @Prop({ required: false, type: String })
  fees?: string
}

// @Schema({ timestamps: false })
class TimeFrame {
  @Prop({ required: true, type: String, enum: TimeFrameCode })
  code: TimeFrameCode

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  value: string | number
}

const TimeFrameSchema = SchemaFactory.createForClass(TimeFrame)

@Schema({ timestamps: true })
export class Exchange implements IExchange {
  _id: string

  @Prop({ required: true, type: String, enum: ExchangeCode, unique: true })
  code: ExchangeCode

  @Prop({ required: true, type: String, unique: true })
  name: string

  @Prop({ required: true, type: UrlsSchema })
  urls: UrlsSchema

  @Prop({ required: true, type: String })
  version: string

  @Prop({ required: true, type: [TimeFrameSchema] })
  timeframes: ITimeFrame[]

  @Prop({ required: true, type: Number })
  timeout: number

  @Prop({ required: true, type: Number })
  rateLimit: number

  @Prop({ required: true, type: [String] })
  symbols: string[]
}

export const ExchangesSchema = SchemaFactory.createForClass(Exchange)
ExchangesSchema.index({ code: 1 }, { unique: true, sparse: true })
ExchangesSchema.index({ name: 1 }, { unique: true, sparse: true })

export const exchangeModelFactory: AsyncModelFactory = {
  name: Exchange.name,
  useFactory: () => {
    const schema = ExchangesSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
}
