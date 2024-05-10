import { createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const createOrderActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Create Market / Limit Order',
    displayName: 'Choose and create "market" or "limit" order. It can be "sell" or "buy" order',
    name: 'create_order',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
      type: exchangeCommon.order_type,
      side: exchangeCommon.side,
      amount: exchangeCommon.amount,
      price: exchangeCommon.price(),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.createOrder(
        propsValue.symbol,
        propsValue.type,
        propsValue.side,
        propsValue.amount,
        propsValue.price,
      )

      return response
    }
  })
