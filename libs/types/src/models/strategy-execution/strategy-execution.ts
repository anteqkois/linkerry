import { Id } from '@market-connector/shared'
import { IExchange } from '../exchange'
import { IStrategyExecution_StaticMarket_Property } from './strategy-execution-static-market'

export enum StrategyExecutionType {
  StrategyExecutionDynamicMarkets = 'StrategyExecutionDynamicMarkets',
  StrategyExecutionStaticMarkets = 'StrategyExecutionStaticMarkets',
}

export interface IStrategyExecution extends IStrategyExecution_StaticMarket_Property {
  user: Id
  exchanges: Id
  type: StrategyExecutionType
}

export interface IStrategyExecution_Populated {
  exchanges: IExchange[]
}

export interface IStrategyExecution_CreateInput {
  exchanges: Id[]
  type: StrategyExecutionType
}
