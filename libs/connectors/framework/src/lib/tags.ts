export const connectorsTag = [
  'cryptocurrency',
  'trading',
  'alerts',
  'exchange',
  'data feed',
  'stock market',
  'chart',
  'core',
  'time',
  'plan',
  'connector',
] as const
export type ConnectorTag = typeof connectorsTag[number]
