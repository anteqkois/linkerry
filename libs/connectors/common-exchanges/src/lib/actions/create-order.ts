import { createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const createOrderActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    displayName: 'Create Market / Limit Order',
    description: 'Choose and create "market" or "limit" order. It can be "sell" or "buy" order',
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
