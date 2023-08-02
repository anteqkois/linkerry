import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { StrategyBuy } from './strategy-buy.schema'
import {
  IStrategyBuy_StaticMarket,
  IStrategyBuy_StaticMarket_Markets,
  Id,
  StrategyBuy_TypeType,
} from '@market-connector/types'

export type StrategyBuyStaticMarketDocument = mongoose.HydratedDocument<StrategyBuyStaticMarket>

class StrategyBuyStaticMarketMarkets implements IStrategyBuy_StaticMarket_Markets {
  @Prop({ requiredPaths: true, type: mongoose.Schema.Types.ObjectId, ref: 'Markets' })
  readonly id: Id

  @Prop({ requiredPaths: true, type: String })
  readonly group: string

  @Prop({ requiredPaths: true, type: Number })
  readonly priority: number
}

const StrategyBuyStaticMarketMarketsSchema = SchemaFactory.createForClass(StrategyBuyStaticMarketMarkets)

@Schema()
export class StrategyBuyStaticMarket extends StrategyBuy implements IStrategyBuy_StaticMarket {
  override type: StrategyBuy_TypeType.STATIC_MARKET

  @Prop({ required: true, type: [StrategyBuyStaticMarketMarketsSchema] })
  readonly markets: Array<IStrategyBuy_StaticMarket_Markets>
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
