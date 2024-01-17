import { DedupeStrategy, Polling, Property, TriggerStrategy, createTrigger, pollingHelper } from '@linkerry/connectors-framework'
import { coingeckoCommon } from '../common'

const polling: Polling<any, any> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async ({ auth, propsValue, lastItemId }) => {
    const currentValues = (await coingeckoCommon.getCoins()) ?? []
    const items = currentValues
    // .filter((f) => Object.keys(f).length > 0)
    // .map((item, index) => ({
    //   id: index + 1,
    //   data: item,
    // }))
    // .filter((f) => isNil(lastItemId) || f.data.row > (lastItemId as number))
    return items.reverse()
  },
}

export const fetchTopHundred = createTrigger({
  description: 'Fetch top 100 coins data',
  displayName: 'Fetch top 100 coins',
  name: 'fetch_top_hundred',
  type: TriggerStrategy.POLLING,
  onEnable: async (context) => {
    await pollingHelper.onEnable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: context.propsValue,
    })
  },
  props: {
    interval: Property.Number({
      displayName: 'Interval',
      name: 'minutes_interval',
      required: true,
      description: 'Every x minutes fetch data (min: 5, max: 60)',
      validators: [],
    }),
  },
  run: async (ctx) => {
    return []
  },
  sampleData: {},
  onDisable: async (ctx) => {
    ctx.setSchedule({
      cronExpression: '',
      // timezone: ''
    })
  },
})
