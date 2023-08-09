import { Id } from '../../utils'
import { IStrategyBuy_DynamicMarket_Property } from './strategy-dynamic-market'
import { StrategyBuy_StaticMarket_Property } from './strategy-static-market'

export enum StrategyBuyType {
  StrategyBuyDynamicMarkets = 'StrategyBuyDynamicMarkets',
  StrategyBuyStaticMarkets = 'StrategyBuyStaticMarkets',
}

export interface IStrategyBuy_Condition {
  id: Id
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

// export interface IStrategyBuyPopulated{
// strategySell: IStrategySell[]
// }

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
