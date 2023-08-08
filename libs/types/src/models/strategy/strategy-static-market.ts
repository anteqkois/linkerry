import { IStrategy, IStrategyInput, StrategyType } from './strategy'

export interface IStrategy_StaticMarket
  extends Omit<IStrategy, keyof Strategy_StaticMarket_Property>,
    Required<Strategy_StaticMarket_Property> {
  type: StrategyType.StrategyStaticMarkets
}

export interface IStrategy_StaticMarket_Input extends Omit<IStrategyInput, keyof Strategy_StaticMarket_Property> {}

export interface Strategy_StaticMarket_Property {}
