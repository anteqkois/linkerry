import { Property, createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getOrdersActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    description: 'Get Orders',
    displayName: 'Get orders by symbol',
    name: 'get_orders',
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

      const response = await exchangeClient.exchange.fetchOrders(propsValue.symbol, sinceMs, propsValue.limit)
      return response
    },
  })
