import { FlowRun, FlowRunsGetManyQuery, Id } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { FlowRunApi } from './api'

export const flowRunQueryConfig = {
	getMany: (query: FlowRunsGetManyQuery): UseQueryOptions<FlowRun[]> => {
		return {
			queryKey: ['flow-runs', ...Object.values(query)],
			queryFn: async () => (await FlowRunApi.getMany(query)).data,
		}
	},
	getOne: ({ flowRunId }: { flowRunId: Id }): UseQueryOptions<FlowRun> => {
		return {
			queryKey: [`flow-runs`, flowRunId],
			queryFn: async () => (await FlowRunApi.getOne(flowRunId)).data,
		}
	},
}

// interface FlowRunQueryConfig {
// 	getMany: ({ flowId }: FlowRunsGetManyQuery) => UseQueryOptions<FlowRun[]>
// 	getOne: ({ flowRunId }: { flowRunId: Id }) => UseQueryOptions<FlowRun>
// }

// export const flowRunQueryConfig: FlowRunQueryConfig = {
// 	getMany: ({ flowId }: FlowRunsGetManyQuery): UseQueryOptions<FlowRun[]> => {
// 		return {
// 			queryKey: ['flow-runs', flowId],
// 			queryFn: async () => (await FlowRunApi.getMany({ flowId })).data,
// 		}
// 	},
// 	getOne: ({ flowRunId }: { flowRunId: Id }): UseQueryOptions<FlowRun> => {
// 		return {
// 			queryKey: [`flow-runs`, flowRunId],
// 			queryFn: async () => (await FlowRunApi.getOne(flowRunId)).data,
// 		}
// 	},
// }
