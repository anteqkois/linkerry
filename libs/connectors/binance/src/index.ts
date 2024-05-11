import {
  cancelAllSymbolOrdersActionFactory,
  cancelOrderActionFactory,
  cancelOrdersActionFactory,
  createMarketOrderWithCostActionFactory,
  createOrderActionFactory,
  editOrderActionFactory,
  getBidsAsksActionFactory,
  getOHLCVActionFactory,
  getOrderActionFactory,
  getOrdersActionFactory,
  getTickersActionFactory,
  getTradesActionFactory,
  getTradingFeeActionFactory,
  setMarginModeActionFactory
} from '@linkerry/common-exchanges'
import { createConnector } from '@linkerry/connectors-framework'
import { getAccountBalance } from './actions/get-account-balance'
import { binanceAuth } from './common/auth'
import { BinanceClient } from './common/client'

export const coingecko = createConnector({
  displayName: 'Binance',
  logoUrl: '/images/connectors/binance.png',
  triggers: [],
  description: 'Binance connector for interacting with the bigest cryptocurrency exchange',
  minimumSupportedRelease: '0.0.0',
  actions: [
    cancelAllSymbolOrdersActionFactory(BinanceClient, binanceAuth),
    cancelOrderActionFactory(BinanceClient, binanceAuth),
    cancelOrdersActionFactory(BinanceClient, binanceAuth),
    createMarketOrderWithCostActionFactory(BinanceClient, binanceAuth),
    createOrderActionFactory(BinanceClient, binanceAuth),
    editOrderActionFactory(BinanceClient, binanceAuth),
    getAccountBalance,
    getBidsAsksActionFactory(BinanceClient),
    getOHLCVActionFactory(BinanceClient),
    getOrderActionFactory(BinanceClient, binanceAuth),
    getOrdersActionFactory(BinanceClient, binanceAuth),
    getTickersActionFactory(BinanceClient, binanceAuth),
    getTradesActionFactory(BinanceClient, binanceAuth),
    getTradingFeeActionFactory(BinanceClient, binanceAuth),
    setMarginModeActionFactory(BinanceClient, binanceAuth),
  ],
  auth: binanceAuth,
  tags: ['cryptocurrency', 'data feed', 'trends', 'exchange', 'trading'],
})
