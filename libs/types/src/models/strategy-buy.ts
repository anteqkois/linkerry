import { type } from 'os'
import { ICondition } from './condition'
import { IMarket } from './market'
import { IStrategySell } from './strategy-sell'

export enum StrategyBuyTypeType {
  oneTicker = 'oneTicker',
  manyTicker = 'manyTicker',
}

export enum StrategyBuyMarketStrategyType {
  dynamic = 'dynamic',
  static = 'static',
}

export type StrategyWithMarket = {
  marketStrategy: StrategyBuyMarketStrategyType.static
  market: string
  marketProperty: {
    id: IMarket['id']
    exchangeId: IMarket['exchangeId']
    symbol: IMarket['symbol']
  }
}

type StrategyWithMarketPupulated = {
  marketStrategy: StrategyBuyMarketStrategyType.static
  market: string
  marketProperty: {
    id: IMarket['id']
    exchangeId: IMarket['exchangeId']
    symbol: IMarket['symbol']
  }
}

type StrategyWithDynamicMarket = {
  marketStrategy: StrategyBuyMarketStrategyType.dynamic
  conditionMarketProvider: ICondition
}

// Stay with convenction I... :/
export type IStrategyBuy = {
  type: StrategyBuyTypeType
  strategySell: IStrategySell
} & (StrategyWithMarket | StrategyWithDynamicMarket)
