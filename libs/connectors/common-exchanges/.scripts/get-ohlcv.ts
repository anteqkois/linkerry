import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({
  })

  const response = await exchange.fetchOHLCV('BTC/USDT', '1m', undefined, 20)

  console.dir(response, { depth: null })
  // console.log(response)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
