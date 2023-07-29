export enum AlertProviderType {
  TRADING_VIEW = 'tradingView',
  UNKNOWN = 'unknown',
}

interface IBaseAlert {
  handlerUrl: string
}

export interface IAlertTradingView extends IBaseAlert {
  provider: AlertProviderType.TRADING_VIEW
  messagePattern: string
}

export interface IAlertUnknown extends IBaseAlert {
  provider: AlertProviderType.UNKNOWN
}
