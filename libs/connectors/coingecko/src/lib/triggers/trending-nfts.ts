import { DedupeStrategy, Polling,  createTrigger, pollingHelper } from '@linkerry/connectors-framework'
import { CoingeckoApi } from '../common'
import { TriggerStrategy } from '@linkerry/shared'

const polling: Polling<any, any> = {
	strategy: DedupeStrategy.NEW_ITEMS,
	items: async ({ auth, propsValue, lastItemsIds }) => {
		const currentValues = await CoingeckoApi.getTrendings()
		const items = currentValues.body.nfts.map((item) => ({
			id: item.id,
			data: item,
		}))
		return items
	},
}

export const trendingNfts = createTrigger({
	description:
		'Top-5 trending NFTs on CoinGecko based on the highest trading volume in the last 24 hours',
	displayName: 'Top trending NFT collections',
	name: 'trending_nfts',
	type: TriggerStrategy.POLLING,
	props: {	},
	onEnable: async (context) => {
		await pollingHelper.onEnable(polling, {
			auth: context.auth,
			store: context.store,
			propsValue: context.propsValue,
		})
	},
	onDisable: async (context) => {
		await pollingHelper.onDisable(polling, {
			auth: context.auth,
			store: context.store,
			propsValue: context.propsValue,
		})
	},
	run: async (context) => {
		return await pollingHelper.poll(polling, {
			auth: context.auth,
			store: context.store,
			maxItemsToPoll: 1,
			propsValue: context.propsValue,
		})
	},
	test: async (context) => {
		return await pollingHelper.test(polling, {
			auth: context.auth,
			store: context.store,
			propsValue: context.propsValue,
		})
	},
})
