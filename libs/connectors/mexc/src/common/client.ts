import { mexc } from 'ccxt'

export class MexcClient {
  static exchange = new mexc({})

  static setAuth({ access_key, secret_key }: { access_key: string; secret_key: string }) {
    MexcClient.exchange.apiKey = access_key
    MexcClient.exchange.secret = secret_key
  }
}
