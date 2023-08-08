import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Strategy } from './strategy.schema'
import {
  IStrategy_StaticMarket,
  Id,
  StrategyType,
} from '@market-connector/types'

export type StrategyStaticMarketDocument = mongoose.HydratedDocument<StrategyStaticMarket>

@Schema()
export class StrategyStaticMarket extends Strategy implements IStrategy_StaticMarket {
  override type: StrategyType.StrategyStaticMarkets
}

export const StrategyStaticMarketSchema = SchemaFactory.createForClass(StrategyStaticMarket)

export const StrategyStaticMarketModelFactory: AsyncModelFactory = {
  name: StrategyStaticMarket.name,
  imports: [],
  useFactory: () => {
    const schema = StrategyStaticMarketSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
