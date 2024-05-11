import { Exchange } from 'ccxt'

interface ExchangeAuthApiKey {
  api_key: string
  secret_key: string
}

interface ExchangeAuthAccessKey {
  access_key: string
  secret_key: string
}

interface ExchangeAPI {
  api_key: string
  secret: string
}

// TODO change to have ability to implements this interface by exchange clients
export abstract class ExchangeClientInterface {
  exchange!: Exchange
  abstract setAuth(auth: ExchangeAuthApiKey | ExchangeAuthAccessKey): void
}
