import { createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getTickersActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    displayName: 'Get Ticker',
    description: 'Get a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market',
    name: 'get_ticker',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.fetchTicker(propsValue.symbol)
      return response
    },
  })
