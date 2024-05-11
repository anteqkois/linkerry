import { Property, createAction } from '@linkerry/connectors-framework'
import { isEmpty } from '@linkerry/shared'
import { coingeckoAuth } from '../common/auth'
import { CoingeckoApi, coingeckoCommon } from '../common/common'

export const getCoin = createAction({
  auth: coingeckoAuth,
  description: 'Get coin information based on coingecko list',
  displayName: 'Get coin information',
  requireAuth: false,
  name: 'get_coin',
  props: {
    query: coingeckoCommon.query,
    coin_id: Property.DynamicDropdown({
      displayName: 'Coingecko Coin Id',
      required: true,
      description: 'Coin which data will be fetched using coingecko id',
      refreshers: ['query'],
      options: async ({ query, auth }) => {
        if (isEmpty(query))
          return {
            options: [],
            disabled: true,
            placeholder: 'Type query first',
          }

        if (isEmpty(auth))
          return {
            options: [],
            disabled: true,
            placeholder: 'Authenticate first',
          }

        const { body } = await CoingeckoApi.search({ auth, query } as any)

        return {
          options: body.coins.map((coin) => ({ label: `${coin.symbol} (${coin.name})`, value: coin.api_symbol })),
          disabled: false,
          placeholder: 'Select coin',
        }
      },
    }),
  },
  run: async ({ auth, propsValue }) => {
    const { body } = await CoingeckoApi.getCoin({
      auth,
      coinId: propsValue.coin_id,
    })
    return body
  },
})
