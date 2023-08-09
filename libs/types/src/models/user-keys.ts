import { DbTimestamp, Id } from '../utils'
import { ExchangeCode, IExchange } from './exchange'
import { IUser } from './user'

export interface IUserKeys extends DbTimestamp {
  _id: string
  name: string
  exchange: Id
  exchangeCode: ExchangeCode
  user: Id
  salt: string // generate using bcrypt.genSalt();
  kv: number
  aKey: string
  aKeyInfo: string
  sKey: string
  sKeyInfo: string
  // privilages: {}   // implement in future to get know user which action can be done
}

export interface IUserKeysPupulated extends Omit<IUserKeys, 'exchange' | 'user'> {
  exchange: IExchange
  user: IUser
}

// # # # # #     API     # # # # #

export interface IUserKeys_CreateInput {
  name: string
  exchange: Id
  exchangeCode: ExchangeCode
  aKey: string
  sKey: string
}

export interface IUserKeys_CreateResponse {
  userKeys: {
    name: string
    exchange: Id
    exchangeCode: ExchangeCode
    user: Id
    aKeyInfo: string
    sKeyInfo: string
  }
}

export interface IUserKeys_GetManyResponse {
  userKeys: {
    name: string
    exchange: Id
    exchangeCode: ExchangeCode
    user: Id
    aKeyInfo: string
    sKeyInfo: string
  }[]
}
