import { ICondition } from './condition'
import { IMarket } from './market'
import { IStrategySell } from './strategy-sell'

// export enum StrategyBuyTypeType {
//   ONE_SYMBOL = 'oneSymbol',
//   MANY_SYMBOLS = 'manySymbols',
// }

export enum StrategyBuyMarketStrategyType {
  DYNAMIC = 'dynamic',
  STATIC = 'static',
}

interface IStrategyWithMarket {
  market?: string // Id to market in db OR in fiture array to ids
  marketProperty?: {
    id: IMarket['id']
    exchangeId: IMarket['exchangeId']
    symbol: IMarket['symbol']
  }
}

interface IStrategyWithDynamicMarket {
  conditionMarketProvider?: string
}

// # # # # # # # # # #

export interface IStrategyBuy extends IStrategyWithMarket, IStrategyWithDynamicMarket {
  // type: StrategyBuyTypeType
  strategySell: IStrategySell
  marketStrategy: StrategyBuyMarketStrategyType
}

// # # # # # # # # # #

export interface IStrategyBuyStaticMarket
  extends Omit<IStrategyBuy, keyof IStrategyWithMarket>,
    Required<IStrategyWithMarket> {
  marketStrategy: StrategyBuyMarketStrategyType.STATIC
}

export interface IStrategyBuyStaticMarketPopulated extends Omit<IStrategyBuyStaticMarket, 'market'> {
  market: IMarket
}

// # # # # # # # # # #

export interface IStrategyBuyDynamicMarket
  extends Omit<IStrategyBuy, keyof IStrategyWithDynamicMarket>,
    Required<IStrategyWithDynamicMarket> {
  marketStrategy: StrategyBuyMarketStrategyType.DYNAMIC
}

export interface IStrategyBuyDynamicMarketPopulated extends Omit<IStrategyBuyDynamicMarket, 'conditionMarketProvider'> {
  conditionMarketProvider: ICondition
}
