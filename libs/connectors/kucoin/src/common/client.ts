import { kucoin } from 'ccxt'

export class KucoinClient {
  static exchange = new kucoin({})

  static setAuth({ api_key, secret_key, password }: { api_key: string; secret_key: string; password: string }) {
    KucoinClient.exchange.apiKey = api_key
    KucoinClient.exchange.secret = secret_key
    KucoinClient.exchange.password = password
  }
}
