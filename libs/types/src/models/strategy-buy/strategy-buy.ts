import { Id } from '../../utils'
import { IStrategyBuy_DynamicMarket_Property } from './strategy-dynamic-market'
import { StrategyBuy_StaticMarket_Property } from './strategy-static-market'

// export enum StrategyBuyTypeType {
//   ONE_SYMBOL = 'oneSymbol',
//   MANY_SYMBOLS = 'manySymbols',
// }

export enum StrategyBuy_TypeType {
  DYNAMIC_MARKET = 'StrategyBuyDynamicMarkets',
  STATIC_MARKET = 'StrategyBuyStaticMarkets',
}

export interface IStrategyBuy_Condition {
  id: Id

  // conditionProperty?:{ // For future ?
  // active: boolean
  // eventValidityUnix: boolean
  // }

  // Create something like a cllas, to have ability to overide default values ?
  // active: boolean
  // eventValidityUnix: boolean
  // required: boolean
}

export interface IStrategyBuy extends StrategyBuy_StaticMarket_Property, IStrategyBuy_DynamicMarket_Property {
  type: StrategyBuy_TypeType
  name: string
  validityUnix: number
  testMode: boolean
  active: boolean
  triggeredTimes: number
  // type: StrategyBuyTypeType
  strategySell: Id[]
  // strategySellProperty:[] // Store all needed data in stratego, to prevent fetching during some actions ?
  conditions: IStrategyBuy_Condition[]
}

// export interface IStrategyBuyPopulated{
// strategySell: IStrategySell[]
// }

export interface IStrategyBuyInput {
  type: StrategyBuy_TypeType
  name: string
  active: boolean
  testMode: boolean
  // validityUnix: number
  strategySell: Id[]
  conditions: Array<{
    id: Id
    // eventValidityUnix: boolean
  }>
}
