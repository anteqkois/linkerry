import { ExchangeCode, IExchange, TimeFrames } from '@market-connector/types'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type ExchangesDocument = mongoose.HydratedDocument<Exchange>

class UrlsSchema {
  @Prop({ required: true, type: String })
  logo: string

  @Prop({ required: true, type: String })
  www: string

  @Prop({ required: true, type: String })
  fees: string
}

@Schema({ timestamps: true })
export class Exchange implements IExchange {
  _id: string

  @Prop({ required: true, type: String, enum: ExchangeCode })
  code: ExchangeCode

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: UrlsSchema })
  urls: UrlsSchema

  @Prop({ required: true, type: String })
  version: string

  @Prop({ required: true, type: [{ type: String, enum: TimeFrames }] })
  timeframes: TimeFrames[]

  @Prop({ required: true, type: Number })
  timeout: number

  @Prop({ required: true, type: Number })
  rateLimit: number

  @Prop({ required: true, type: [String] })
  symbols: string[]
}

export const ExchangesSchema = SchemaFactory.createForClass(Exchange)


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
