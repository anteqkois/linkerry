import {
  IStrategyBuy,
  IStrategyBuy_CreateInput,
  IStrategyBuy_CreateResponse,
  IStrategyBuy_UpdateInput,
  IStrategyBuy_UpdateResponse,
  StrategyBuyType,
} from './strategy-buy'
import { IStrategyBuy_DynamicMarket_Property } from './strategy-dynamic-market'

export interface IStrategyBuy_StaticMarket
  extends Omit<IStrategyBuy, keyof StrategyBuy_StaticMarket_Property>,
    Required<StrategyBuy_StaticMarket_Property> {
  type: StrategyBuyType.StrategyBuyStaticMarket
}

export interface StrategyBuy_StaticMarket_Property {}

// POST
export interface IStrategyBuy_StaticMarket_CreateInput extends IStrategyBuy_CreateInput {}
export interface IStrategyBuy_StaticMarket_CreateResponse
  extends Omit<IStrategyBuy_CreateResponse, keyof IStrategyBuy_DynamicMarket_Property> {}

// PUT
export interface IStrategyBuy_StaticMarket_UpdateInput
  extends Omit<IStrategyBuy_UpdateInput, keyof IStrategyBuy_DynamicMarket_Property> {}
export interface IStrategyBuy_StaticMarket_UpdateResponse
  extends Omit<IStrategyBuy_UpdateResponse, keyof IStrategyBuy_DynamicMarket_Property> {}
