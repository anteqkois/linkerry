import { IPaginationQuery, IResourceResponse, Id } from '../utils'
import { IExchange } from './exchange'

export enum MarketType {
  spot = 'spot',
  future = 'future',
  swap = 'swap',
  options = 'options',
}

export interface IMarket {
  _id: Id
  code: string // string literal for referencing within an exchange
  exchangeCode: IExchange['code']
  symbol: string // uppercase string literal of a pair of currencies, ID IN CODEBASE 'BTC/USD'
  base: string
  quote: string // uppercase string, unified quote currency code, 3 or more letters
  baseId: string // any string, exchange-specific base currency id
  quoteId: string // any string, exchange-specific quote currency id
  active: boolean // boolean, market status
  type: MarketType
  spot: boolean // whether the market is a spot market
  margin: boolean // whether the market is a margin market
  future: boolean // whether the market is a expiring future
  swap: boolean // whether the market is a perpetual swap
  option: boolean // whether the market is an option contract
  // expiry:  1641370465121, // the unix expiry timestamp in milliseconds, undefined for everything except market[type] `future`
  // taker:    number,        // taker fee rate, 0.002 = 0.2%
  // maker:    number,       // maker fee rate, 0.0016 = 0.16%
  // precision: {            // number of decimal digits "after the dot"
  //     price: number,           // integer or float for TICK_SIZE roundingMode, might be missing if not supplied by the exchange
  //     amount: number,          // integer, might be missing if not supplied by the exchange
  //     cost: number,            // integer, very few exchanges actually have it
  // },
  // limits: {               // value limits when placing orders on this market
  //     amount: {
  //         min: 0.01,      // order amount should be > min
  //         max: 1000,      // order amount should be < max
  //     },
  //     price: { ... },     // same min/max limits for the price of the order
  //     cost:  { ... },     // same limits for order cost = price * amount
  //     leverage: { ... },  // same min/max limits for the leverage of the order
  // },
}

// GET
export interface IMarket_GetQuery extends IPaginationQuery {
  exchangeCode?: IExchange['code']
  symbol?: string
  base?: string
  quote?: string
  active?: boolean
  type?: MarketType
}
export interface IMarket_GetResponse extends IResourceResponse<IMarket[]> {}

// POST
export interface IMarket_CreateInput extends Omit<IMarket, '_id'> {}
