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

// One interface. Theare will be validation logic, which check if StrategyDynamicMarkets have at one buy strategy with conditionMarketProvider
export interface IStrategy {
  user: Id
  name: string
  type: StrategyType
  validityUnix: number
  testMode: boolean
  active: boolean
  triggeredTimes: number
  strategyBuy: Id[]
  strategySell: Id[]
  strategyExecution: Id[]
  state: StrategyState
  // strategyPause: Id[]
}

export interface IStrategy_CreateInput {
  name: string
  type: StrategyType
  // validityUnix: number
  testMode: boolean
  active: boolean
  // triggeredTimes: number
  strategyBuy: Id[]
  strategySell: Id[]
  // strategyPause: Id[]
}
