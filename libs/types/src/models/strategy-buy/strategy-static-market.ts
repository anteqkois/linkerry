import { IStrategyBuy, IStrategyBuy_CreateInput, StrategyBuy_TypeType } from './strategy-buy'

export interface IStrategyBuy_StaticMarket
  extends Omit<IStrategyBuy, keyof StrategyBuy_StaticMarket_Property>,
    Required<StrategyBuy_StaticMarket_Property> {
  type: StrategyBuy_TypeType.StrategyBuyStaticMarkets
}

export interface IStrategyBuy_StaticMarket_Input extends IStrategyBuy_CreateInput {
}

export interface StrategyBuy_StaticMarket_Property {
}
