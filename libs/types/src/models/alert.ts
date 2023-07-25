import { ICondition } from './condition'
import { IUser } from './user'

export enum AlertProvidersType {
  TRADING_VIEW = 'tradingView',
}

export interface IAlertInput {
  name: string
  alertProvider: AlertProvidersType
  active: boolean
  alertValidityUnix: number
  symbol?: string
  testMode: boolean
}

export interface IAlertResponse {
  alert: IAlert
  condition: ICondition
}

export interface IAlert {
  _id: string
  kind: string
  user: IUser
  condition: ICondition
  name: string
  active: boolean
  alertValidityUnix: number
  alertProvider: AlertProvidersType
  testMode: boolean
  alertHandlerUrl: string
}

export interface IAlertTradingView extends IAlert {
  alertProvider: AlertProvidersType.TRADING_VIEW
  symbol?: string
  messagePattern?: string
}
