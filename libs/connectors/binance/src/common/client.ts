import { binance } from 'ccxt';

export class BinanceClient  {
	static exchange = new binance({})

	static setAuth({ api_key, secret_key }: { api_key: string; secret_key: string }) {
		BinanceClient.exchange.apiKey = api_key
		BinanceClient.exchange.secret = secret_key
	}
}
