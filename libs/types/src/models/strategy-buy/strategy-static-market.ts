import { IMarket } from '../market'
import { IStrategyBuy, StrategyBuyMarketStrategyType } from './strategy-buy'

export interface StrategyWithMarketProperty {
  market?: string // Id to market in db OR in fiture array to ids
  marketProperty?: {
    id: IMarket['code']
    exchangeId: IMarket['exchangeCode']
    symbol: IMarket['symbol']
  }
}

export interface IStrategyBuyStaticMarket
  extends Omit<IStrategyBuy, keyof StrategyWithMarketProperty>,
    Required<StrategyWithMarketProperty> {
  marketStrategy: StrategyBuyMarketStrategyType.STATIC
}

export interface IStrategyBuyStaticMarketPopulated extends Omit<IStrategyBuyStaticMarket, 'market'> {
  market: IMarket
}
