import { FlowVersion, Id } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { FlowVersionApi } from './api'

export const flowVersionQueryConfig = {
  getOne: ({ flowVersionId }: { flowVersionId: Id }): UseQueryOptions<FlowVersion | undefined> => {
    return {
      queryKey: [`flow-version`, flowVersionId],
      queryFn: async () => (await FlowVersionApi.getOne(flowVersionId)).data,
    }
  },
}
