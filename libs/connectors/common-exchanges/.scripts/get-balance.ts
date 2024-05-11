import { bybit } from 'ccxt'

const main = async () => {
  // const exchange = new kucoin({
  //   apiKey: process.env['KUCOIN_KEY'],
  //   secret: process.env['KUCOIN_SECRET'],
  //   password: process.env['KUCOIN_PASSWORD'],
  // })
  // const response = await exchange.fetchBalance()
  // console.dir(response, { depth: null })

  const exchange = new bybit({
    apiKey: process.env['BYBIT_API_KEY'],
    secret: process.env['BYBIT_SECRET_KEY'],
  })
  const response = await exchange.fetchBalance()
  console.dir(response, { depth: null })

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
