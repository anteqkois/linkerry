import { Id } from '../../utils'
import { IMarket } from '../market'
import { IStrategyBuy, IStrategyBuyInput, StrategyBuy_TypeType } from './strategy-buy'

export interface IStrategyBuy_StaticMarket_Markets {
  id: string // Id to market in db OR in fiture array to ids
  // marketProperty?: { // for now, maybe it would be better to only store id of market to prevent issues with refreshing market data ?
  //   code: IMarket['code']
  //   exchangeCode: IMarket['exchangeCode']
  //   symbol: IMarket['symbol']
  // }
  priority: number
  group: string
}

export interface StrategyBuy_StaticMarket_Property {
  markets?: IStrategyBuy_StaticMarket_Markets[]
}

export interface IStrategyBuy_StaticMarket
  extends Omit<IStrategyBuy, keyof StrategyBuy_StaticMarket_Property>,
    Required<StrategyBuy_StaticMarket_Property> {
  type: StrategyBuy_TypeType.STATIC_MARKET
}

export interface IStrategyBuy_StaticMarket_Populated extends Omit<IStrategyBuy_StaticMarket, 'markets'> {
  markets: IMarket
}

export interface IStrategyBuy_StaticMarket_MarketsInput {
  id: Id
  priority: number
  group: string
}

export interface IStrategyBuy_StaticMarket_Input extends IStrategyBuyInput {
  markets: Array<IStrategyBuy_StaticMarket_MarketsInput>
}
