export type TradingViewTemplateArg = { alertId: string }

export const tradingViewMessagePattern = ({}: TradingViewTemplateArg ) => {
  return `{"text": "BTCUSD Greater Than 9000"}`
}
