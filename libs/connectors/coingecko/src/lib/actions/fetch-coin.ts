import { Property, createAction } from '@linkerry/connectors-framework'
import { search } from '../common/search'

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
			displayName: 'Coin ID',
			name: 'coin_id',
			required: true,
			description: 'Coin which data will be fetched',
			refreshers: ['query'],
			options: async ({ query }) => {
				const { coins } = await search(query as string)

				console.log('COIN', coins)

				return {
					options: coins.map((coin) => ({ label: `${coin.symbol} (${coin.name})`, value: coin.api_symbol })),
					disabled: false,
				}
			},
			// options: async ({ auth }) => {
			//   if (!auth) {
			//     return {
			//       disabled: true,
			//     }
			//   }
			//   return {
			//     options: [
			//       {
			//         label: 'Option One',
			//         value: '1',
			//       },
			//       {
			//         label: 'Option Two',
			//         value: '2',
			//       },
			//     ],
			//   }
			// },
		}),
	},
	run: async (ctx) => {
		return []
	},
})
