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
  setMarginModeActionFactory,
} from '@linkerry/common-exchanges'
import { createConnector } from '@linkerry/connectors-framework'
import { getAccountBalance } from './actions/get-account-balance'
import { binanceAuth } from './common/auth'
import { BinanceClient } from './common/client'

export const coingecko = createConnector({
  displayName: 'Binance',
  logoUrl: '/images/connectors/binance.png',
  triggers: [],
  description: 'Binance connector for interacting with the biggest cryptocurrency exchange',
  descriptionLong:
    "The Binance connector is a comprehensive tool designed for seamless interaction with the world's largest cryptocurrency exchange, Binance. With this app, you can execute a wide range of functionalities including placing buy and sell orders, checking real-time market prices, and managing your portfolio. It allows you to track your account balances, access detailed trading history, and automate trading strategies with ease. Additionally, the connector supports advanced features like setting stop-loss and take-profit limits, and integrating various trading bots. Whether you're a novice trader or a seasoned crypto investor, this connector provides a robust solution for all your Binance exchange needs.",
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
