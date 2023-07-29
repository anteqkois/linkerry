export enum TimeFrames {
  '1m' = '1m',
  '5m' = '5m',
  '15m' = '15m',
  '30m' = '30m',
  '1h' = '1h',
  '4h' = '4h',
  '8h' = '8h',
  '1d' = '1d',
  '1w' = '1w',
  '1M' = '1M',
}

export interface IExchange {
  id: string   // ID IN CODEBASE
  name: string
  // countries: [ US, CN, EU ],   // array of ISO country codes
  urls: {
    logo: string
    // api: {
    //   ...
    // },
    www: string
    fees: string
  }
  version: string // string ending with digits
  // has: {
  //   ...
  // },
  timeframes: Record<TimeFrames, string>
  timeout: number // number in milliseconds
  rateLimit: number // number in milliseconds
  symbols: string[] // sorted list of string symbols (traded pairs), First support only pair to USDT, BUSD, USDC spot
}
