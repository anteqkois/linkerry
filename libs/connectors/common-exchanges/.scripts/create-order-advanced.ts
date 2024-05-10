import { binance } from 'ccxt'

const main = async () => {
  const exchange = new binance({
    apiKey: process.env['BINANCE_API_KEY'],
    secret: process.env['BINANCE_SECRET_KEY'],
  })

  try {
    const response = await exchange.createOrder('BTC/USDT', 'limit', 'buy', 0.00015, 40_000,{
      // stopLossPrice: 35_000,
      // takeProfitPrice: 45_000
      triggerPrice: 40_000,
      takeProfitPrice: 70_000
    })
    console.log(response)
  } catch (error) {
    console.log('ERROR')
    console.log(error.message)
  }

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
