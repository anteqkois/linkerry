import { PlanProductConfiguration } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { UsageApi } from './api'

export const usageQueryConfig = {
  getMany: (): UseQueryOptions<Partial<PlanProductConfiguration>> => {
    return {
      queryKey: ['usage'],
      queryFn: async () => (await UsageApi.getOne()).data,
    }
  },
}
