import { IStrategyBuy, StrategyBuyMarketStrategyType } from "./strategy-buy"

export interface StrategyWithDynamicMarketProperty {
  conditionMarketProvider?: string
}

export interface IStrategyBuyDynamicMarket
  extends Omit<IStrategyBuy, keyof StrategyWithDynamicMarketProperty>,
    Required<StrategyWithDynamicMarketProperty> {
  marketStrategy: StrategyBuyMarketStrategyType.DYNAMIC
}
