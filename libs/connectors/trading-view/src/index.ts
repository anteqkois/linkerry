import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { tradingViewNewAlert } from './triggers/new-alert'

export const telegramBot = createConnector({
  displayName: 'Trading View',
  description: 'Live advanced charting and analysis for financial markets',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/trading-view.png',
  tags: ['alerts', 'chart', 'cryptocurrency', 'data feed', 'exchange', 'stock market', 'trading'],
  auth: ConnectorAuth.None(),
  actions: [
  ],
  triggers: [tradingViewNewAlert],
})
