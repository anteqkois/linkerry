import { createConnector } from '@linkerry/connectors-framework'
import { getCoin } from './actions/get-coin'
import { getDeFiInfo } from './actions/get-defi-info'
import { getGlobalInfo } from './actions/get-global-info'
import { coingeckoAuth } from './common/auth'
import { trendingCoins } from './triggers/trending-coins'
import { trendingNfts } from './triggers/trending-nfts'

export const coingecko = createConnector({
  displayName: 'Coingecko Free',
  description: 'Coingecko connector for cryptocurrency data. Use it with Coingecko Demo API key',
  logoUrl: '/images/connectors/coingecko.png',
  triggers: [trendingCoins, trendingNfts],
  actions: [getCoin, getGlobalInfo, getDeFiInfo],
  minimumSupportedRelease: '0.0.0',
  auth: coingeckoAuth,
  tags: ['cryptocurrency', 'data feed', 'trends'],
})
