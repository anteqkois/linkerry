import { IStrategy, IStrategy_CreateInput, IStrategy_CreateResponse, IStrategy_UpdateInput, IStrategy_UpdateResponse, StrategyType } from './strategy'

export interface IStrategy_StaticMarket
  extends Omit<IStrategy, keyof Strategy_StaticMarket_Property>,
    Required<Strategy_StaticMarket_Property> {
  type: StrategyType.StrategyStaticMarket
}

export interface Strategy_StaticMarket_Property {}

// POST
export interface IStrategy_StaticMarket_CreateInput extends Omit<IStrategy_CreateInput, keyof Strategy_StaticMarket_Property> {}

export interface IStrategy_StaticMarket_CreateResponse extends Omit<IStrategy_CreateResponse, keyof Strategy_StaticMarket_Property> {}

// PUT
export interface IStrategy_StaticMarket_UpdateInput extends Omit<IStrategy_UpdateInput, keyof Strategy_StaticMarket_Property> {}

export interface IStrategy_StaticMarket_UpdateResponse extends Omit<IStrategy_UpdateResponse, keyof Strategy_StaticMarket_Property> {}

