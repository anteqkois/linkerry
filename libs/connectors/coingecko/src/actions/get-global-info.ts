import { createAction } from '@linkerry/connectors-framework'
import { coingeckoAuth } from '../common/auth'
import { CoingeckoApi } from '../common/common'

export const getGlobalInfo = createAction({
  auth: coingeckoAuth,
  description: 'Get Global Info',
  displayName:
    'Get cryptocurrency global data including active cryptocurrencies, markets, total crypto market cap and etc. Ciongecko updates this data every 10 minutes for all the API plans',
  name: 'get_global_info',
  requireAuth: false,
  props: {},
  run: async ({ auth }) => {
    const { body } = await CoingeckoApi.getGlobalInfo({
      auth,
    })
    return body
  },
})
