import { createAction } from '@linkerry/connectors-framework'
import { binance } from 'ccxt'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getOrderActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    displayName: 'Get Order',
    description: 'Get order by id and symbol',
    name: 'get_order',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await (exchangeClient.exchange as binance).fetchOrder(propsValue.symbol)
      return response
    },
  })
