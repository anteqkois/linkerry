import { createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getTickersActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Get Ticekr',
    displayName: 'Get a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market',
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
