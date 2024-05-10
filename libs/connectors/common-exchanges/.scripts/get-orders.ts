import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({
    apiKey: process.env['BINANCE_API_KEY'],
    secret: process.env['BINANCE_SECRET_KEY'],
  })

  const response = await exchange.fetchOrders('BTC/USDT')

  console.dir(response, { depth: null })
  // console.log(response)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
