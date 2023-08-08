import { Id } from '../../utils'
import { IExchange } from '../exchange'
import { IStrategyExecution_StaticMarket_Property } from './strategy-execution-static-market'

export enum StrategyExecutionType {
  StrategyExecutionDynamicMarkets,
  StrategyExecutionStaticMarkets,
}

export interface IStrategyExecution extends IStrategyExecution_StaticMarket_Property{
  user: Id
  exchanges: Id
  type: StrategyExecutionType
}

export interface IStrategyExecutionPopulated {
  exchanges: IExchange[]
}

export interface IStrategyExecutionInput {
  exchanges: Id[]
  type: StrategyExecutionType
}

