import { DedupeStrategy, Polling, Property, createTrigger, pollingHelper } from '@linkerry/connectors-framework';
import { TriggerStrategy } from '@linkerry/shared';
import { CoingeckoApi } from '../common';

const polling: Polling<
	any,
	{
		coin_id: string;
    interval: number;
	}
> = {
	strategy: DedupeStrategy.TIMEBASED,
	items: async ({ auth, propsValue, lastFetchEpochMS, store }) => {
		// const currentValues = (await coingeckoApi.getCoins()) ?? []
		const { body } = await CoingeckoApi.getCoin(propsValue.coin_id)
		return body as unknown as any[]
	},
}

export const fetchById = createTrigger({
	description: 'Fetch by coingecko id',
	displayName: 'Fetch by coingecko id',
	name: 'fetch_by_id',
	type: TriggerStrategy.POLLING,
	requireAuth: false,
	props: {
		// todo refactor to use dynamic dropdown
		coin_id: Property.ShortText({
			displayName: 'Coin ID',
			required: true,
			description: 'ID from coingecko list: https://apiguide.coingecko.com/getting-started/10-min-tutorial-guide/1-get-data-by-id-or-address',
		}),
		interval: Property.Number({
			displayName: 'Interval',
			required: true,
			description: 'Every x minutes fetch data (min: 5, max: 60)',
		}),
	},
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
