import { createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const editOrderActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Edit Market / Limit Order',
    displayName: 'Edit a trade order based on order id',
    name: 'edit_order',
    props: {
      order_id: exchangeCommon.order_id,
      symbol: exchangeCommon.symbol(exchangeClient),
      type: exchangeCommon.order_type,
      side: exchangeCommon.side,
      amount: exchangeCommon.amount,
      price: exchangeCommon.price({
        required: false,
      }),
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
    },
  })