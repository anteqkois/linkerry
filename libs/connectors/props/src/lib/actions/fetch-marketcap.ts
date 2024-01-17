import { Property, createAction } from '@linkerry/connectors-framework'

export const fetchMarktecap = createAction({
  description: 'Fetch crypto marketcap',
  displayName: 'Fetch crypot marketcap',
  name: 'fetch_marketcap',
  requireAuth: false,
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
})
