import { IStrategy, IStrategy_CreateInput, IStrategy_CreateResponse, StrategyType } from './strategy'

export interface IStrategy_StaticMarket
  extends Omit<IStrategy, keyof Strategy_StaticMarket_Property>,
    Required<Strategy_StaticMarket_Property> {
  type: StrategyType.StrategyStaticMarkets
}

export interface IStrategy_StaticMarket_CreateInput extends Omit<IStrategy_CreateInput, keyof Strategy_StaticMarket_Property> {}

export interface IStrategy_StaticMarket_CreateResponse extends Omit<IStrategy_CreateResponse, keyof Strategy_StaticMarket_Property> {}

export interface Strategy_StaticMarket_Property {}
