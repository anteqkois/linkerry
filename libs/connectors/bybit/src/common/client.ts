import { bybit } from 'ccxt';

export class BybitClient  {
	static exchange = new bybit({})

	static setAuth({ apiKey, secretKey }: { apiKey: string; secretKey: string }) {
		BybitClient.exchange.apiKey = apiKey
		BybitClient.exchange.secret = secretKey
	}
}
