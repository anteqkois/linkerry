import { bybit } from 'ccxt'

const main = async () => {
  // const exchange = new kucoin({
  //   apiKey: process.env['KUCOIN_KEY'],
  //   secret: process.env['KUCOIN_SECRET'],
  //   password: process.env['KUCOIN_PASSWORD'],
  // })
  // const response = await exchange.fetchBalance()
  // console.dir(response, { depth: null })

  // const exchange = new binance({
  //   apiKey: process.env['BINANCE_API_KEY'],
  //   secret: process.env['BINANCE_SECRET_KEY'],
  // })
  // const response = await exchange.fetchBalance()
  // console.dir(response, { depth: null })

  const exchange = new bybit({
    apiKey: process.env['BYBIT_API_KEY'],
    secret: process.env['BYBIT_SECRET_KEY'],
  })
  const response = await exchange.fetchBalance()
  console.dir(response, { depth: null })

  // const exchange = new mexc({
  //   apiKey: process.env['MEXC_ACCESS_KEY'],
  //   secret: process.env['MEXC_SECRET_KEY'],
  // })
  // const response = await exchange.fetchBalance()
  // console.dir(response, { depth: null })

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
