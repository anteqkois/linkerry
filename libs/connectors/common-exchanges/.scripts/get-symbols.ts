import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({})

  await exchange.loadMarkets()

  console.log(exchange.symbols)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
