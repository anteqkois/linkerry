import { ConditionType, ICondition, ICondition_CreateInput } from "./condition"

export enum AlertProvider {
  TradingView = 'TradingView',
  Unknown = 'Unknown',
}


interface IBaseAlert {
  handlerUrl: string
}

export interface IAlertTradingView extends IBaseAlert {
  provider: AlertProvider.TradingView
  messagePattern: string
}

export interface IAlertUnknown extends IBaseAlert {
  provider: AlertProvider.Unknown
}

export interface IAlert extends ICondition {
  type: ConditionType.Alert
  alert: IAlertTradingView | IAlertUnknown
}

export interface IAlert_CreateInput extends ICondition_CreateInput {
  type: ConditionType.Alert
  alert: {
    provider: AlertProvider
  }
}
