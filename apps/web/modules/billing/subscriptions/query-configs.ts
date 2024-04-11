import { SubscriptionPopulated } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { SubscriptionsApi } from './api'

export const subscriptionsQueryConfig = {
  getMany: (): UseQueryOptions<SubscriptionPopulated[]> => {
    return {
      queryKey: ['subscriptions'],
      queryFn: async () => (await SubscriptionsApi.getMany()).data,
    }
  },
}
