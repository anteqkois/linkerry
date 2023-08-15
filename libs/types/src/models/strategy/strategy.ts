import { DbTimestamp, IPaginationQuery, IResourceResponse, Id, Nullable } from '../../utils'
import { IStrategyBuy, IStrategyBuy_CreateInput } from '../strategy-buy'
import { IUser } from '../user'
import { Strategy_StaticMarket_Property } from './strategy-static-market'

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

export interface IStrategyStrategyBuy {
  active: boolean
  // For existing strategies buy
  id?: Id
  strategyBuy?: Id
}

export interface IStrategyStrategyBuyExpanded {
  active: boolean
  // For existing strategies buy
  id: Id
  strategyBuy: IStrategyBuy
}

type ExpandableKeys = 'strategyBuy.strategyBuy' | 'user'

// One interface. Theare will be validation logic, which check if StrategyDynamicMarket have at one buy strategy with conditionMarketProvider
export interface IStrategy extends Partial<Strategy_StaticMarket_Property>, DbTimestamp {
  _id: Id
  user: Id
  name: string
  type: StrategyType
  validityUnix: number
  testMode: boolean
  active: boolean
  triggeredTimes: number
  state: StrategyState
  strategyBuy: IStrategyStrategyBuy[]
  // strategySell: Id[]
  // strategyExecution: Id[]
  // strategyPause: Id[]
}

export interface IStrategyExpand<E extends ExpandableKeys | undefined = undefined>
  extends Omit<IStrategy, 'strategyBuy' | 'user'> {
  user: E extends 'user' ? IUser : Id
  strategyBuy: E extends 'strategyBuy.strategyBuy' ? IStrategyStrategyBuyExpanded[] : IStrategyStrategyBuy[]
}

// GET
export interface IStrategy_GetOneQuery {
  expand?: ExpandableKeys[]
}
export type IStrategy_GetOneResponse<E extends ExpandableKeys | undefined = undefined> = Nullable<IStrategyExpand<E>>

export interface IStrategy_GetQuery extends IPaginationQuery {}
export interface IStrategy_GetResponse extends IResourceResponse<IStrategy[]> {}

// POST
export interface IStrategy_CreateInput {
  name: string
  type: StrategyType
  // validityUnix: number
  testMode: boolean
  active: boolean
  // For request to create strategy buy
  strategyBuy: (IStrategyStrategyBuy & { strategyBuyCreateInput?: IStrategyBuy_CreateInput })[]
  // strategySell: Id[]
  // strategyPause: Id[]
}
export interface IStrategy_CreateResponse extends IStrategy {}

// PUT
export interface IStrategy_UpdateInput extends Omit<IStrategy, '_id' | 'user'> {}
export interface IStrategy_UpdateResponse extends IStrategy_CreateResponse {}

// PATCH
export interface IStrategy_PatchInput extends Partial<IStrategy_UpdateInput> {}
export interface IStrategy_PatchResponse extends IStrategy_UpdateResponse {}
