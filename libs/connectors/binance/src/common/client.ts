import { binance } from 'ccxt';

export class BinanceClient  {
	static exchange = new binance({})

	static setAuth({ apiKey, secretKey }: { apiKey: string; secretKey: string }) {
		BinanceClient.exchange.apiKey = apiKey
		BinanceClient.exchange.secret = secretKey
	}
}
