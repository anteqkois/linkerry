import { Id } from '../../utils'
import { IStrategyBuy_DynamicMarket_Property } from './strategy-dynamic-market'
import { StrategyBuy_StaticMarket_Property } from './strategy-static-market'

export enum StrategyBuyType {
  StrategyBuyDynamicMarket = 'StrategyBuyDynamicMarket',
  StrategyBuyStaticMarket = 'StrategyBuyStaticMarket',
}

export interface IStrategyBuy_Condition {
  id: Id
  condition: Id
  active: boolean
  // conditionProperty?:{ // For future ?
  // eventValidityUnix: boolean
  // }

  // Create something like a cllas, to have ability to overide default values ?
  // eventValidityUnix: boolean
  // required: boolean
}

export interface IStrategyBuy extends StrategyBuy_StaticMarket_Property, IStrategyBuy_DynamicMarket_Property {
  user: Id
  type: StrategyBuyType
  name: string
  validityUnix: number
  triggeredTimes: number
  conditions: IStrategyBuy_Condition[]
}

// POST
export interface IStrategyBuy_CreateInput {
  type: StrategyBuyType
  name: string
  conditions: IStrategyBuy_Condition[]
}

export interface IStrategyBuy_CreateResponse {
  type: StrategyBuyType
  name: string
  conditions: IStrategyBuy_Condition[]
}

// PUT
export interface IStrategyBuy_UpdateInput extends IStrategyBuy {}
export interface IStrategyBuy_UpdateResponse extends IStrategyBuy_CreateResponse {}
