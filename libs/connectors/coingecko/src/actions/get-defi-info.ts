import { createAction } from '@linkerry/connectors-framework'
import { coingeckoAuth } from '../common/auth'
import { CoingeckoApi } from '../common/common'

export const getDeFiInfo = createAction({
  auth: coingeckoAuth,
  description: 'Get De-Fi Info',
  displayName: 'Query top 100 cryptocurrency global decentralized finance (defi) data including defi market cap, trading volume.',
  name: 'get_global_info',
  requireAuth: false,
  props: {},
  run: async ({ auth }) => {
    const { body } = await CoingeckoApi.getDeFiInfo({
      auth,
    })
    return body
  },
})
