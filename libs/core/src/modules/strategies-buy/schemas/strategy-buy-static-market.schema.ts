import {
  IStrategyBuy_StaticMarket, StrategyBuyType
} from '@market-connector/types'
import { AsyncModelFactory, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { StrategyBuy } from './strategy-buy.schema'

export type StrategyBuyStaticMarketDocument = mongoose.HydratedDocument<StrategyBuyStaticMarket>

@Schema()
export class StrategyBuyStaticMarket extends StrategyBuy implements IStrategyBuy_StaticMarket {
  override type: StrategyBuyType.StrategyBuyStaticMarkets
}

export const StrategyBuyStaticMarketSchema = SchemaFactory.createForClass(StrategyBuyStaticMarket)

export const StrategyBuyStaticMarketModelFactory: AsyncModelFactory = {
  name: StrategyBuyStaticMarket.name,
  imports: [],
  useFactory: () => {
    const schema = StrategyBuyStaticMarketSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
