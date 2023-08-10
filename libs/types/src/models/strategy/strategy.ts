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
  StrategyDynamicMarket = 'StrategyDynamicMarket',
  StrategyStaticMarket = 'StrategyStaticMarket',
}

export interface IStrategy_StrategyBuy {
  id: Id
  strategyBuy: Id
  active: boolean
}

// One interface. Theare will be validation logic, which check if StrategyDynamicMarket have at one buy strategy with conditionMarketProvider
export interface IStrategy {
  _id: Id
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

// POST
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
export interface IStrategy_CreateResponse extends IStrategy {}

// PUT
export interface IStrategy_UpdateInput extends IStrategy {}
export interface IStrategy_UpdateResponse extends IStrategy_CreateResponse {}
