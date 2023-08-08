import { Id } from '../../utils'
import { IExchange } from '../exchange'
import { IStrategyExecution, IStrategyExecutionInput, StrategyExecutionType } from './strategy-execution'

export interface IStrategyExecution_StaticMarket
  extends Omit<IStrategyExecution, keyof IStrategyExecution_StaticMarket_MarketsInput>,
    Required<IStrategyExecution_StaticMarket_MarketsInput> {
  type: StrategyExecutionType.StrategyExecutionStaticMarkets
}

export interface IStrategyExecution_StaticMarket_MarketsInput {
  id: Id
  priority: number
  group: string
}

export interface IStrategyExecution_StaticMarket_Input extends IStrategyExecutionInput {
  markets: Array<IStrategyExecution_StaticMarket_MarketsInput>
}

export interface IStrategyExecution_StaticMarket_Markets {
  id: Id // Id to market in db OR in fiture array to ids
  // marketProperty?: { // for now, maybe it would be better to only store id of market to prevent issues with refreshing market data ? EDIT for now use simple populate
  //   code: IMarket['code'] // TODO remember to refresh this data when some properties change
  //   exchangeCode: IMarket['exchangeCode']
  //   symbol: IMarket['symbol']
  // }
  priority: number
  group: string
}

export interface IStrategyExecution_StaticMarket_Property {
  markets?: IStrategyExecution_StaticMarket_Markets[]
}
