import {
  cancelAllSymbolOrdersActionFactory,
  cancelOrderActionFactory,
  cancelOrdersActionFactory,
  createOrderActionFactory,
  editOrderActionFactory,
  getAccountBalanceActionFactory,
  getOHLCVActionFactory,
  getOrdersActionFactory,
  getTickersActionFactory,
  getTradesActionFactory,
  getTradingFeeActionFactory,
  setMarginModeActionFactory,
} from '@linkerry/common-exchanges'
import { createConnector } from '@linkerry/connectors-framework'
import { bybitAuth } from './common/auth'
import { BybitClient } from './common/client'

export const coingecko = createConnector({
  displayName: 'ByBit',
  logoUrl: '/images/connectors/bybit.png',
  triggers: [],
  description: 'ByBit connector for interacting with the exchange',
  minimumSupportedRelease: '0.0.0',
  actions: [
    cancelAllSymbolOrdersActionFactory(BybitClient, bybitAuth),
    cancelOrderActionFactory(BybitClient, bybitAuth),
    cancelOrdersActionFactory(BybitClient, bybitAuth),
    createOrderActionFactory(BybitClient, bybitAuth),
    editOrderActionFactory(BybitClient, bybitAuth),
    getAccountBalanceActionFactory(BybitClient, bybitAuth),
    getOHLCVActionFactory(BybitClient),
    getOrdersActionFactory(BybitClient, bybitAuth),
    getTickersActionFactory(BybitClient, bybitAuth),
    getTradesActionFactory(BybitClient, bybitAuth),
    getTradingFeeActionFactory(BybitClient, bybitAuth),
    setMarginModeActionFactory(BybitClient, bybitAuth),
  ],
  auth: bybitAuth,
  tags: ['cryptocurrency', 'data feed', 'trends', 'exchange', 'trading'],
})
