import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({
    apiKey: process.env['BINANCE_API_KEY'],
    secret: process.env['BINANCE_SECRET_KEY'],
  })

  // const response = await exchange.('BTC/USDT')

  // console.dir(response, { depth: null })
  // console.dir(exchange, { depth: null })
  console.log(exchange.timeframes)
  // console.log(response)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
