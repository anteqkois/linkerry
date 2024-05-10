import { Property, createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getTradesActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Get Trades',
    displayName: 'Get all trades made on your account',
    name: 'get_trades',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
      since: exchangeCommon.since_date({
        required: false,
      }),
      limit: Property.Number({
        displayName: 'Limit',
        description: 'the maximum amount of trades to get',
        required: false,
      }),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const sinceMs = propsValue.since ? new Date(propsValue.since).getTime() : undefined

      const response = await exchangeClient.exchange.fetchMyTrades(propsValue.symbol, sinceMs, propsValue.limit)
      return response
    },
  })
