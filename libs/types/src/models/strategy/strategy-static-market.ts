import { IStrategy, IStrategy_CreateInput, StrategyType } from './strategy'

export interface IStrategy_StaticMarket
  extends Omit<IStrategy, keyof Strategy_StaticMarket_Property>,
    Required<Strategy_StaticMarket_Property> {
  type: StrategyType.StrategyStaticMarkets
}

export interface IStrategy_StaticMarket_Input extends Omit<IStrategy_CreateInput, keyof Strategy_StaticMarket_Property> {}

export interface Strategy_StaticMarket_Property {}
