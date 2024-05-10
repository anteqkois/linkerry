import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({  })

  const response = await exchange.fetchTicker('BTC/USDT')

  console.dir(response, { depth: null })
  // console.log(response)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
