import { IStrategyBuy, IStrategyBuy_CreateInput, IStrategyBuy_CreateResponse, IStrategyBuy_UpdateInput, IStrategyBuy_UpdateResponse, StrategyBuyType } from './strategy-buy'

export interface IStrategyBuy_StaticMarket
  extends Omit<IStrategyBuy, keyof StrategyBuy_StaticMarket_Property>,
    Required<StrategyBuy_StaticMarket_Property> {
  type: StrategyBuyType.StrategyBuyStaticMarket
}

export interface StrategyBuy_StaticMarket_Property {}

// POST
export interface IStrategyBuy_StaticMarket_CreateInput extends IStrategyBuy_CreateInput {}
export interface IStrategyBuy_StaticMarket_CreateResponse extends IStrategyBuy_CreateResponse {}

// PUT
export interface IStrategyBuy_StaticMarket_UpdateInput extends IStrategyBuy_UpdateInput {}
export interface IStrategyBuy_StaticMarket_UpdateResponse extends IStrategyBuy_UpdateResponse {}
