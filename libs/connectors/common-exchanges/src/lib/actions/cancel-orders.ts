import { Property, createAction } from '@linkerry/connectors-framework'
import { binance } from 'ccxt'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

// ! use only for exchanges with this feature, so here i cast exchange type to binance which support it
export const cancelOrdersActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    description: 'Cancel Orders',
    displayName: 'Cancel multiple open orders in a market',
    name: 'cancel_orders',
    props: {
      ids: Property.Array({
        displayName: 'Order ids',
        required: true,
      }),
      symbol: exchangeCommon.symbol(exchangeClient, {
        required: false,
      }),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await (exchangeClient.exchange as binance).cancelOrders(propsValue.ids as string[], propsValue.symbol)
      return response
    }
  })
