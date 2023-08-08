import { Id } from '../../utils'
import { IStrategyBuy_DynamicMarket_Property } from './strategy-dynamic-market'
import { StrategyBuy_StaticMarket_Property } from './strategy-static-market'

export enum StrategyBuy_TypeType {
  StrategyBuyDynamicMarkets,
  StrategyBuyStaticMarkets,
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
  type: StrategyBuy_TypeType
  name: string
  validityUnix: number
  triggeredTimes: number
  conditions: IStrategyBuy_Condition[]
}

// export interface IStrategyBuyPopulated{
// strategySell: IStrategySell[]
// }

export interface IStrategyBuyInput {
  type: StrategyBuy_TypeType
  name: string
  conditions: IStrategyBuy_Condition[]
}
