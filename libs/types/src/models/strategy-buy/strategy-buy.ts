import { ICondition } from '../condition'
import { IMarket } from '../market'
import { IStrategySell } from '../strategy-sell'
import { IStrategyBuyDynamicMarket, StrategyWithDynamicMarketProperty } from './strategy-dynamic-market'
import { StrategyWithMarketProperty } from './strategy-static-market'

// export enum StrategyBuyTypeType {
//   ONE_SYMBOL = 'oneSymbol',
//   MANY_SYMBOLS = 'manySymbols',
// }

export enum StrategyBuyMarketStrategyType {
  DYNAMIC = 'dynamic',
  STATIC = 'static',
}

export interface IStrategyBuyDynamicMarketPopulated extends Omit<IStrategyBuyDynamicMarket, 'conditionMarketProvider'> {
  conditionMarketProvider: ICondition
}

export interface IStrategyBuy extends StrategyWithMarketProperty, StrategyWithDynamicMarketProperty {
  // type: StrategyBuyTypeType
  strategySell: IStrategySell
  marketStrategy: StrategyBuyMarketStrategyType
}
