import { Property, Validators, createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getOHLCVActionFactory = (exchangeClient: ExchangeClientInterface) =>
  createAction({
    displayName: 'Get OHLC Symbol',
    description: 'Get historical candlestick data containing the open, high, low, close price, and the volume of a market',
    name: 'get_ohlcv',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
      timeframe: exchangeCommon.timeframe(exchangeClient),
      since: exchangeCommon.since_date({
        description: 'Date time of the earliest candle to fetch',
        required: false,
      }),
      limit: Property.Number({
        displayName: 'Limit',
        description: 'the maximum amount of trades to get (max. 200)',
        required: false,
        validators: [Validators.maxValue(200)],
      }),
    },
    run: async ({ propsValue }) => {
      const sinceMs = propsValue.since ? new Date(propsValue.since).getTime() : undefined

      const response = await exchangeClient.exchange.fetchOHLCV(propsValue.symbol, propsValue.timeframe, sinceMs, propsValue.limit)
      return response
    },
  })
