import { DbTimestamp, IResourceResponse, Id } from '@market-connector/shared'
import { ExchangeCode, IExchange } from './exchange'
import { User } from '@market-connector/shared'

type PrivateFields = 'aKey' | 'sKey' | 'kv' | 'salt'

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
  user: User
}

// GET
export interface IUserKeys_GetOneResponse extends Omit<IUserKeys, PrivateFields> {}
export interface IUserKeys_GetResponse extends IResourceResponse<IUserKeys_GetOneResponse[]> {}

// POST
export interface IUserKeys_CreateInput {
  name: string
  exchange: Id
  exchangeCode: ExchangeCode
  aKey: string
  sKey: string
}

export interface IUserKeys_CreateResponse extends Omit<IUserKeys, PrivateFields> {}
