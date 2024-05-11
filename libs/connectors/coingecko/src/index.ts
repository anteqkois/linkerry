import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { fetchCoin } from './actions/fetch-coin'
import { fetchMarktecap } from './actions/fetch-marketcap'
import { trendingCoins } from './triggers/trending-coins'
import { trendingNfts } from './triggers/trending-nfts'

export const coingecko = createConnector({
  displayName: 'Coingecko',
  logoUrl: '/images/connectors/coingecko.png',
  triggers: [trendingCoins, trendingNfts],
  description: 'Coingecko connector for cryptocurrency data',
  minimumSupportedRelease: '0.0.0',
  actions: [fetchMarktecap, fetchCoin],
  auth: ConnectorAuth.None(),
  tags: ['cryptocurrency', 'data feed', 'trends'],
})
