import { DedupeStrategy, Polling, createTrigger, pollingHelper } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'
import { coingeckoAuth } from '../common/auth'
import { CoingeckoApi } from '../common/common'

const polling: Polling<any, any> = {
  strategy: DedupeStrategy.NEW_ITEMS,
  items: async ({ auth, propsValue, lastItemsIds }) => {
    const currentValues = await CoingeckoApi.getTrendings({
      auth,
    })
    const items = currentValues.body.coins.map((item) => ({
      id: item.item.id,
      data: item.item,
    }))
    return items
  },
}

export const trendingCoins = createTrigger({
  auth: coingeckoAuth,
  description: 'Top-7 trending coins on CoinGecko as searched by users in the last 24 hours (Ordered by most popular first)',
  displayName: 'Top trending coins',
  name: 'trending_coins',
  type: TriggerStrategy.POLLING,
  requireAuth: false,
  props: {},
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
