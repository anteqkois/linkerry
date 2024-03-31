import { FlowGetManyQuery, FlowPopulated } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { FlowApi } from './api'

export const flowQueryConfig = {
	getMany: (query: FlowGetManyQuery): UseQueryOptions<FlowPopulated[]> => {
		return {
			queryKey: ['flows'],
			queryFn: async () => (await FlowApi.getMany(query)).data,
		}
	},
}
