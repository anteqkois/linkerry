import { kucoin } from 'ccxt';

export class KucoinClient {
  static exchange = new kucoin({})

  static setAuth({ apiKey, secretKey, password }: { apiKey: string; secretKey: string; password: string }) {
    KucoinClient.exchange.apiKey = apiKey
    KucoinClient.exchange.secret = secretKey
    KucoinClient.exchange.password = password
  }
}
