import {
  cancelAllSymbolOrdersActionFactory,
  cancelOrderActionFactory,
  createMarketOrderWithCostActionFactory,
  createOrderActionFactory,
  editOrderActionFactory,
  getAccountBalanceActionFactory,
  getBidsAsksActionFactory,
  getOHLCVActionFactory,
  getOrderActionFactory,
  getTickersActionFactory,
  getTradesActionFactory,
  getTradingFeeActionFactory
} from '@linkerry/common-exchanges'
import { createConnector } from '@linkerry/connectors-framework'
import { kucoinAuth } from './common/auth'
import { KucoinClient } from './common/client'

export const coingecko = createConnector({
  displayName: 'KuCoin',
  logoUrl: '/images/connectors/kucoin.png',
  triggers: [],
  description: 'KuCoin connector for interacting with the exchange',
  minimumSupportedRelease: '0.0.0',
  actions: [
    cancelAllSymbolOrdersActionFactory(KucoinClient, kucoinAuth),
    cancelOrderActionFactory(KucoinClient, kucoinAuth),
    createMarketOrderWithCostActionFactory(KucoinClient, kucoinAuth),
    createOrderActionFactory(KucoinClient, kucoinAuth),
    editOrderActionFactory(KucoinClient, kucoinAuth),
    getAccountBalanceActionFactory(KucoinClient, kucoinAuth),
    getBidsAsksActionFactory(KucoinClient),
    getOHLCVActionFactory(KucoinClient),
    getOrderActionFactory(KucoinClient, kucoinAuth),
    getTickersActionFactory(KucoinClient, kucoinAuth),
    getTradesActionFactory(KucoinClient, kucoinAuth),
    getTradingFeeActionFactory(KucoinClient, kucoinAuth),
  ],
  auth: kucoinAuth,
  tags: ['cryptocurrency', 'data feed', 'trends', 'exchange', 'trading'],
})
