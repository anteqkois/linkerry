import { Exchange } from 'ccxt';

interface ExchangeAuth {
  apiKey: string;
  secretKey: string;
}

interface ExchangeAPI {
  apiKey: string;
  secret: string;
}

// TODO change to have ability to implements this interface by exchange clients
export abstract class ExchangeClientInterface {
  exchange!: Exchange;
  abstract setAuth(auth: ExchangeAuth): void;
}
