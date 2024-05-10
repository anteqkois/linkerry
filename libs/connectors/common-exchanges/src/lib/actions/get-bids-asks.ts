import { createAction } from '@linkerry/connectors-framework'
import { exchangeCommon } from '../common/common'
import { ExchangeClientInterface } from '../types'

export const getBidsAsksActionFactory = (exchangeClient: ExchangeClientInterface) =>
  createAction({
    description: 'Get Bids Asks',
    displayName: 'Get the bid and ask price and volume for market',
    name: 'get_bids_asks',
    props: {
      symbol: exchangeCommon.symbol(exchangeClient),
    },
    run: async ({ propsValue }) => {
      const response = await exchangeClient.exchange.fetchBidsAsks([propsValue.symbol])
      return response[propsValue.symbol]
    },
  })
