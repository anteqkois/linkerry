import { Property } from '@linkerry/connectors-framework'

export * from './api'

export const coingeckoCommon = {
  query: Property.ShortText({
    description: 'Type query phrase to search for coin',
    displayName: 'Search Query',
    required: true,
    // todo implement validators
    // defaultProcessors:[]
  }),
}
