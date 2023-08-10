import { IPaginationQuery, IResourceResponse, Id } from '../utils'

export enum TimeFrameCode {
  '1m' = '1m',
  '3m' = '3m',
  '5m' = '5m',
  '15m' = '15m',
  '30m' = '30m',
  '45m' = '45m',
  '1h' = '1h',
  '2h' = '2h',
  '3h' = '3h',
  '4h' = '4h',
  '8h' = '8h',
  '1d' = '1d',
  '1w' = '1w',
  '1M' = '1M',
}

export interface ITimeFrame {
  code: TimeFrameCode
  value: string | number
}

export enum ExchangeCode {
  ace = 'ace',
  alpaca = 'alpaca',
  ascendex = 'ascendex',
  bequant = 'bequant',
  bigone = 'bigone',
  binance = 'binance',
  binancecoinm = 'binancecoinm',
  binanceus = 'binanceus',
  binanceusdm = 'binanceusdm',
  bingx = 'bingx',
  bit2c = 'bit2c',
  bitbank = 'bitbank',
  bitbay = 'bitbay',
  bitbns = 'bitbns',
  bitcoincom = 'bitcoincom',
  bitfinex = 'bitfinex',
  bitfinex2 = 'bitfinex2',
  bitflyer = 'bitflyer',
  bitforex = 'bitforex',
  bitget = 'bitget',
  bithumb = 'bithumb',
  bitmart = 'bitmart',
  bitmex = 'bitmex',
  bitopro = 'bitopro',
  bitpanda = 'bitpanda',
  bitrue = 'bitrue',
  bitso = 'bitso',
  bitstamp = 'bitstamp',
  bitstamp1 = 'bitstamp1',
  bittrex = 'bittrex',
  bitvavo = 'bitvavo',
  bkex = 'bkex',
  bl3p = 'bl3p',
  blockchaincom = 'blockchaincom',
  btcalpha = 'btcalpha',
  btcbox = 'btcbox',
  btcmarkets = 'btcmarkets',
  btctradeua = 'btctradeua',
  btcturk = 'btcturk',
  bybit = 'bybit',
  cex = 'cex',
  coinbase = 'coinbase',
  coinbaseprime = 'coinbaseprime',
  coinbasepro = 'coinbasepro',
  coincheck = 'coincheck',
  coinex = 'coinex',
  coinfalcon = 'coinfalcon',
  coinmate = 'coinmate',
  coinone = 'coinone',
  coinsph = 'coinsph',
  coinspot = 'coinspot',
  cryptocom = 'cryptocom',
  currencycom = 'currencycom',
  delta = 'delta',
  deribit = 'deribit',
  digifinex = 'digifinex',
  exmo = 'exmo',
  fmfwio = 'fmfwio',
  gate = 'gate',
  gateio = 'gateio',
  gemini = 'gemini',
  hitbtc = 'hitbtc',
  hitbtc3 = 'hitbtc3',
  hollaex = 'hollaex',
  huobi = 'huobi',
  huobijp = 'huobijp',
  huobipro = 'huobipro',
  idex = 'idex',
  independentreserve = 'independentreserve',
  indodax = 'indodax',
  kraken = 'kraken',
  krakenfutures = 'krakenfutures',
  kucoin = 'kucoin',
  kucoinfutures = 'kucoinfutures',
  kuna = 'kuna',
  latoken = 'latoken',
  lbank = 'lbank',
  lbank2 = 'lbank2',
  luno = 'luno',
  lykke = 'lykke',
  mercado = 'mercado',
  mexc = 'mexc',
  mexc3 = 'mexc3',
  ndax = 'ndax',
  novadax = 'novadax',
  oceanex = 'oceanex',
  okcoin = 'okcoin',
  okex = 'okex',
  okex5 = 'okex5',
  okx = 'okx',
  paymium = 'paymium',
  phemex = 'phemex',
  poloniex = 'poloniex',
  poloniexfutures = 'poloniexfutures',
  probit = 'probit',
  tidex = 'tidex',
  timex = 'timex',
  tokocrypto = 'tokocrypto',
  upbit = 'upbit',
  wavesexchange = 'wavesexchange',
  wazirx = 'wazirx',
  whitebit = 'whitebit',
  woo = 'woo',
  yobit = 'yobit',
  zaif = 'zaif',
  zonda = 'zonda',
}

export interface IExchange {
  _id: Id
  code: ExchangeCode // ID IN CODEBASE
  name: string
  // countries: [ US, CN, EU ],   // array of ISO country codes
  urls: {
    logo?: string
    // api: {
    //   ...
    // },
    www?: string
    fees?: string
  }
  version: string // string ending with digits
  // has: {
  //   ...
  // },
  timeframes: Array<ITimeFrame>
  timeout: number // number in milliseconds
  rateLimit: number // number in milliseconds
  symbols: string[] // sorted list of string symbols (traded pairs), First support only pair to USDT, BUSD, USDC spot
}


// GET
// TODO change to handle arrays
export interface IExchange_GetQuery extends IPaginationQuery {
  code?: IExchange['code']
  name?: string
  symbol?: string
  timeframes: TimeFrameCode
}
export interface IExchange_GetResponse extends IResourceResponse<IExchange[]> {}

// POST
export interface IExchange_CreateInput extends Omit<IExchange, '_id'>{}
