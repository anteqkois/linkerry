import { IExchange } from './exchange'
import { IUser } from './user'

export interface IExchangeKeys {
  _id: string
  exchange: string
  user: string
  salt: string // generate using bcrypt.genSalt();
  kv: number
  aKey: string
  aKeyInfo: string
  sKey: string
  sKeyInfo: string
  // privilages: {}   // implement in future to get know user which action can be done
}

export interface IExchangeKeysPupulated extends Omit<IExchangeKeys, 'exchange' | 'user'> {
  exchange: IExchange
  user: IUser
}

// # # # # #     API     # # # # #

export interface IExchangeKeysInput {
  exchange: string
  user: string
  aKey: string
  sKey: string
}

export interface IExchangeKeysResponse {
  exchange: string
  user: string
  aKeyInfo: string
  sKeyInfo: string
}
