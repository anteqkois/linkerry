import {
  cancelAllSymbolOrdersActionFactory,
  cancelOrderActionFactory,
  cancelOrdersActionFactory,
  createOrderActionFactory,
  getAccountBalanceActionFactory,
  getBidsAsksActionFactory,
  getOHLCVActionFactory,
  getOrderActionFactory,
  getOrdersActionFactory,
  getTickersActionFactory,
  getTradesActionFactory,
} from '@linkerry/common-exchanges'
import { createConnector } from '@linkerry/connectors-framework'
import { mexcAuth } from './common/auth'
import { MexcClient } from './common/client'

export const coingecko = createConnector({
  displayName: 'MEXC',
  logoUrl: '/images/connectors/mexc.png',
  triggers: [],
  description: 'MEXC connector for interacting with the exchange',
  minimumSupportedRelease: '0.0.0',
  actions: [
    cancelAllSymbolOrdersActionFactory(MexcClient, mexcAuth),
    cancelOrderActionFactory(MexcClient, mexcAuth),
    cancelOrdersActionFactory(MexcClient, mexcAuth),
    createOrderActionFactory(MexcClient, mexcAuth),
    getAccountBalanceActionFactory(MexcClient, mexcAuth),
    getBidsAsksActionFactory(MexcClient),
    getOHLCVActionFactory(MexcClient),
    getOrderActionFactory(MexcClient, mexcAuth),
    getOrdersActionFactory(MexcClient, mexcAuth),
    getTickersActionFactory(MexcClient, mexcAuth),
    getTradesActionFactory(MexcClient, mexcAuth),
  ],
  auth: mexcAuth,
  tags: ['cryptocurrency', 'data feed', 'trends', 'exchange', 'trading'],
})
