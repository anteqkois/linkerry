import { ConnectorAuth, createConnector } from '@market-connector/connectors-framework'
import { fetchTopHundred } from './lib/triggers/fetch-top-hundred'

export const coingecko = createConnector({
  name: '@market-connector/coingecko',
  displayName: 'Coingecko',
  logoUrl: '',
  triggers: [fetchTopHundred],
  description: 'Coingecko connector for cryptocurrency data',
  minimumSupportedRelease: '0.0.0',
  actions: [],
  auth: ConnectorAuth.None(),
})
