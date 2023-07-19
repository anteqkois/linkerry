export type TradingViewTemplateArg = { alertId: string }

export const tradingViewMessagePattern = ({ alertId }: TradingViewTemplateArg) => {
  return `{"alertId": "${ alertId }", "ticker": "{{ticker}}", "close": "{{close}}"}`
}
