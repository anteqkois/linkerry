import { Id } from '../../utils'

export enum StrategyState {
  Idle,
  WaitForBuySignal,
  OpenPosition,
  ClosePosition,
  Paused,
  Inactive,
  Error,
  RecoveryMode,
  Backtesting,
}

export enum StrategyType {
  StrategyDynamicMarkets,
  StrategyStaticMarkets,
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

export interface IStrategyInput {
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
