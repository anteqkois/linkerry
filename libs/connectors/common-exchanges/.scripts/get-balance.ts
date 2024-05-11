import { kucoin } from 'ccxt'

const main = async () => {
  const exchange = new kucoin({
    apiKey: process.env['KUCOIN_KEY'],
    secret: process.env['KUCOIN_SECRET'],
    password: process.env['KUCOIN_PASSWORD'],
  })

  const response = await exchange.fetchBalance()

  console.dir(response, { depth: null })
  // console.log(response)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
