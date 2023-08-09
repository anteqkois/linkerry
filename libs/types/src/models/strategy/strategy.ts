import { Id } from '../../utils'

export enum StrategyState {
  Idle = 'Idle',
  WaitForBuySignal = 'WaitForBuySignal',
  OpenPosition = 'OpenPosition',
  ClosePosition = 'ClosePosition',
  Paused = 'Paused',
  Inactive = 'Inactive',
  Error = 'Error',
  RecoveryMode = 'RecoveryMode',
  Backtesting = 'Backtesting',
}

export enum StrategyType {
  StrategyDynamicMarkets = 'StrategyDynamicMarkets',
  StrategyStaticMarkets = 'StrategyStaticMarkets',
}

export interface IStrategy_StrategyBuy {
  id: Id
  strategyBuy: Id
  active: boolean
}

// One interface. Theare will be validation logic, which check if StrategyDynamicMarkets have at one buy strategy with conditionMarketProvider
export interface IStrategy {
  user: Id
  name: string
  type: StrategyType
  validityUnix: number
  testMode: boolean
  active: boolean
  triggeredTimes: number
  state: StrategyState
  strategyBuy: IStrategy_StrategyBuy[]
  // strategySell: Id[]
  // strategyExecution: Id[]
  // strategyPause: Id[]
}

export interface IStrategy_CreateInput {
  name: string
  type: StrategyType
  // validityUnix: number
  testMode: boolean
  active: boolean
  strategyBuy: IStrategy_StrategyBuy[]
  // strategySell: Id[]
  // strategyPause: Id[]
}
