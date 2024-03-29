import { Property, createAction } from '@linkerry/connectors-framework'
import { isEmpty } from '@linkerry/shared'
import { CoingeckoApi } from '../common'

export const fetchCoin = createAction({
	description: 'Fetch coin information based on coingecko list',
	displayName: 'Fetch coin information',
	requireAuth: false,
	name: 'fetch_coin',
	props: {
		query: Property.Text({
			description: 'Type query phrase to search for coin',
			displayName: 'Search Query',
			required: true,
			// todo implement validators
			// defaultProcessors:[]
		}),
		coin_id: Property.DynamicDropdown({
			displayName: 'Coingecko Coin Id',
			required: true,
			description: 'Coin which data will be fetched using coingecko id',
			refreshers: ['query'],
			options: async ({ query }) => {
				if (isEmpty(query))
					return {
						options: [],
						disabled: true,
						placeholder: 'Type query first',
					}

				const { body } = await CoingeckoApi.search(query as string)

				return {
					options: body.coins.map((coin) => ({ label: `${coin.symbol} (${coin.name})`, value: coin.api_symbol })),
					disabled: false,
					placeholder: 'Select coin',
				}
			},
		}),
	},
	run: async (context) => {
		const { body } = await CoingeckoApi.getCoin(context.propsValue.coin_id)
		return body
	},
})
