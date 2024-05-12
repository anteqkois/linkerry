import { createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const createMarketOrderWithCostActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    displayName: 'Create Market Order with Cost',
    description: 'Create a market order by providing the symbol, side and cost',
    name: 'create_market_order_with_cost',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
      side: exchangeCommon.side,
      cost: exchangeCommon.cost,
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)
      const response = await exchangeClient.exchange.createMarketOrderWithCost(propsValue.symbol, propsValue.side, propsValue.cost)
      return response
    },
  })
