import { createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const cancelAllSymbolOrdersActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Cancel All Symbol Orders',
    displayName: 'Cancel all open orders in a market for given symbol',
    name: 'cancel_all_symbol_orders',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.cancelAllOrders(propsValue.symbol)
      return response
    }
  })
