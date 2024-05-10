import { createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const cancelOrderActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Cancel Order',
    displayName: 'Cancel order based on given id',
    name: 'cancel_order',
    props: {
      order_id:  exchangeCommon.order_id,
      symbol: exchangeCommon.symbol(exchangeClient, {
        description: 'Unified symbol of the market the order was made in',
      }),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.cancelOrder(propsValue.order_id, propsValue.symbol)
      return response
    }
  })
