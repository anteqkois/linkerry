import { isNull } from '@market-connector/shared';
import { Store } from '../context';

interface TimebasedPolling<AuthValue, PropsValue> {
	strategy: DedupeStrategy.TIMEBASED
	items: (params: { auth: AuthValue; store: Store; propsValue: PropsValue; lastFetchEpochMS: number }) => Promise<
		{
			epochMilliSeconds: number
			data: unknown
		}[]
	>
}

interface LastItemPolling<AuthValue, PropsValue> {
	strategy: DedupeStrategy.LAST_ITEM
	items: (params: { auth: AuthValue; store: Store; propsValue: PropsValue; lastItemId: unknown }) => Promise<
		{
			id: unknown
			data: unknown
		}[]
	>
}

interface NewItemsPolling<AuthValue, PropsValue> {
	strategy: DedupeStrategy.NEW_ITEMS
	items: (params: { auth: AuthValue; store: Store; propsValue: PropsValue; lastItemsIds: unknown }) => Promise<
		{
			id: unknown
			data: unknown
		}[]
	>
}

export enum DedupeStrategy {
	TIMEBASED,
	LAST_ITEM,
	NEW_ITEMS,
}

export type Polling<AuthValue, PropsValue> =
	| TimebasedPolling<AuthValue, PropsValue>
	| LastItemPolling<AuthValue, PropsValue>
	| NewItemsPolling<AuthValue, PropsValue>

export const pollingHelper = {
	async poll<AuthValue, PropsValue>(
		polling: Polling<AuthValue, PropsValue>,
		{ store, auth, propsValue, maxItemsToPoll }: { store: Store; auth: AuthValue; propsValue: PropsValue; maxItemsToPoll?: number },
	): Promise<unknown[]> {
		switch (polling.strategy) {
			case DedupeStrategy.TIMEBASED: {
				const lastEpochMilliSeconds = (await store.get<number>('lastPoll')) ?? 0
				const items = await polling.items({ store, auth, propsValue, lastFetchEpochMS: lastEpochMilliSeconds })
				const newLastEpochMilliSeconds = items.reduce((acc, item) => Math.max(acc, item.epochMilliSeconds), lastEpochMilliSeconds)
				await store.put('lastPoll', newLastEpochMilliSeconds)
				return items.filter((f) => f.epochMilliSeconds > lastEpochMilliSeconds).map((item) => item.data)
			}
			case DedupeStrategy.LAST_ITEM: {
				const lastItemId = await store.get<unknown>('lastItemId')
				const items = await polling.items({ store, auth, propsValue, lastItemId })

				const lastItemIndex = items.findIndex((f) => f.id === lastItemId)
				let newItems = []
				if (isNull(lastItemId) || lastItemIndex == -1) {
					newItems = items ?? []
				} else {
					newItems = items?.slice(0, lastItemIndex) ?? []
				}
				// Sorted from newest to oldest
				if (!isNull(maxItemsToPoll)) {
					// Get the last polling.maxItemsToPoll items
					newItems = newItems.slice(-maxItemsToPoll)
				}
				const newLastItem = newItems?.[0]?.id
				if (!isNull(newLastItem)) {
					await store.put('lastItem', newLastItem)
				}
				return newItems.map((item) => item.data)
			}
			case DedupeStrategy.NEW_ITEMS: {
				const lastItemsIds = (await store.get<unknown>('lastItemsIds')) ?? []
				const items = await polling.items({ store, auth, propsValue, lastItemsIds })

				if (!Array.isArray(lastItemsIds)) throw new Error(`Can not retrive lastItemsIds. It isn't array`)

				let newItems = items.filter((item) => !lastItemsIds.includes(item.id))

				// Sorted from newest to oldest
				if (!isNull(maxItemsToPoll)) {
					// Get the last polling.maxItemsToPoll items
					newItems = newItems.slice(-maxItemsToPoll)
				}
				if (!isNull(items)) {
					await store.put(
						'lastItemsIds',
						items.map((item) => item.id),
					)
				}
				return newItems.map((item) => item.data)
			}
		}
	},
	async onEnable<AuthValue, PropsValue>(
		polling: Polling<AuthValue, PropsValue>,
		{ store, auth, propsValue }: { store: Store; auth: AuthValue; propsValue: PropsValue },
	): Promise<void> {
		switch (polling.strategy) {
			case DedupeStrategy.TIMEBASED: {
				await store.put('lastPoll', Date.now())
				break
			}
			case DedupeStrategy.LAST_ITEM: {
				const items = await polling.items({ store, auth, propsValue, lastItemId: null })
				const lastItemId = items?.[0]?.id
				if (!isNull(lastItemId)) {
					await store.put('lastItem', lastItemId)
				} else {
					await store.delete('lastItem')
				}
				break
			}
			case DedupeStrategy.NEW_ITEMS: {
				const items = await polling.items({ store, auth, propsValue, lastItemsIds: null })
				if (!isNull(items)) {
					await store.put(
						'lastItemsIds',
						items.map((item) => item.id),
					)
				} else {
					await store.delete('lastItemsIds')
				}
				break
			}
		}
	},
	async onDisable<AuthValue, PropsValue>(
		polling: Polling<AuthValue, PropsValue>,
		params: { store: Store; auth: AuthValue; propsValue: PropsValue },
	): Promise<void> {
		switch (polling.strategy) {
			case DedupeStrategy.TIMEBASED:
			case DedupeStrategy.LAST_ITEM:
			case DedupeStrategy.NEW_ITEMS:
				return
		}
	},
	async test<AuthValue, PropsValue>(
		polling: Polling<AuthValue, PropsValue>,
		{ auth, propsValue, store }: { store: Store; auth: AuthValue; propsValue: PropsValue },
	): Promise<unknown[]> {
		let items = []
		switch (polling.strategy) {
			case DedupeStrategy.TIMEBASED: {
				items = await polling.items({ store, auth, propsValue, lastFetchEpochMS: 0 })
				break
			}
			case DedupeStrategy.LAST_ITEM: {
				items = await polling.items({ store, auth, propsValue, lastItemId: null })
				break
			}
			case DedupeStrategy.NEW_ITEMS: {
				items = await polling.items({ store, auth, propsValue, lastItemsIds: null })
				break
			}
		}
		return getFirstFiveOrAll(items.map((item) => item.data))
	},
}

function getFirstFiveOrAll(array: unknown[]) {
	if (array.length <= 5) {
		return array
	} else {
		return array.slice(0, 5)
	}
}
