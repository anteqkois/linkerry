import { createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getTradingFeeActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth,
    description: 'Get Trading Fee',
    displayName: 'Get the trading fees for a market',
    name: 'get_trading_fee',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
    },
    run: async ({auth,  propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.fetchTradingFee(propsValue.symbol)
      return response
    },
  })
