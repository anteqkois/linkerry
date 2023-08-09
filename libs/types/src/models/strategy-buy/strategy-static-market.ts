import { IStrategyBuy, IStrategyBuy_CreateInput, IStrategyBuy_CreateResponse, StrategyBuyType } from './strategy-buy'

export interface IStrategyBuy_StaticMarket
  extends Omit<IStrategyBuy, keyof StrategyBuy_StaticMarket_Property>,
    Required<StrategyBuy_StaticMarket_Property> {
  type: StrategyBuyType.StrategyBuyStaticMarkets
}

export interface IStrategyBuy_StaticMarket_CreateInput extends IStrategyBuy_CreateInput {
}

export interface IStrategyBuy_StaticMarket_Response extends IStrategyBuy_CreateResponse {
}

export interface StrategyBuy_StaticMarket_Property {
}
