import { ConnectorAuth, createConnector } from '@market-connector/connectors-framework'
import { fetchTopHundred } from './lib/triggers/fetch-top-hundred'

export const coingecko = createConnector({
  name: '@market-connector/coingecko',
  displayName: 'Coingecko',
  logoUrl: 'https://static.coingecko.com/s/coingecko-branding-guide-8447de673439420efa0ab1e0e03a1f8b0137270fbc9c0b7c086ee284bd417fa1.png',
  triggers: [fetchTopHundred],
  description: 'Coingecko connector for cryptocurrency data',
  minimumSupportedRelease: '0.0.0',
  actions: [],
  auth: ConnectorAuth.None(),
})
