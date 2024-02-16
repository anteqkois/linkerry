import { Property, createAction } from '@linkerry/connectors-framework'
import { isEmpty } from '@linkerry/shared'
import { CoingeckoApi } from '../common'

export const fetchCoin = createAction({
	description: 'Fetch coin information based on coingecko list',
	displayName: 'Fetch coin information',
	name: 'fetch_coin',
	props: {
		query: Property.Text({
			description: 'Type query phrase to search for coin',
			displayName: 'Search Query',
			name: 'query',
			required: true,
			// todo implement validators
			// defaultTransformers:[]
		}),
		coin_id: Property.DynamicDropdown({
			displayName: 'Coin',
			name: 'coin_id',
			required: true,
			description: 'Coin which data will be fetched',
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
