import { binance } from 'ccxt';
import 'dotenv/config';

const main = async () => {
	const exchange = new binance({
		apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_SECRET_KEY,
	})
	console.log(exchange.checkRequiredCredentials());

	await exchange.loadMarkets()
	const balance = await exchange.fetchBalance()

	process.exit(0)
}

main()
	.then()
	.catch((err) => console.log(err))
