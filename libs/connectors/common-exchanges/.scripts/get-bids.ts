import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({
  })

  const response = await exchange.fetchBidsAsks(['BTC/USDT', 'ETH/USDT'])

  console.dir(response['BTC/USDT'], { depth: null })
  // console.log(response)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
