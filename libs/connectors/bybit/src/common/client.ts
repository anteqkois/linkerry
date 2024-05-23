import { bybit } from 'ccxt'

export class BybitClient {
  static exchange = new bybit({})

  static setAuth({ api_key, secret_key }: { api_key: string; secret_key: string }) {
    BybitClient.exchange.apiKey = api_key
    BybitClient.exchange.secret = secret_key
  }
}
