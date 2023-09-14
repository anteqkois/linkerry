import { ConnectorAuth, createConnector } from '@market-connector/connectors-framework'
import { fetchTopHundred } from './lib/triggers/fetch-top-hundred'

export const coingecko = createConnector({
  name: 'coingecko',
  displayName: 'Coingecko',
  logoUrl: '',
  triggers: [fetchTopHundred],
  description: 'Coingecko connector for cryptocurrency data',
  actions: [],
  auth: ConnectorAuth.None(),
})
