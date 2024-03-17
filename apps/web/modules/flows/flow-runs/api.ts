import { FlowRun, FlowRunsGetManyQuery, Id, } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class FlowRunApi {
	static async getOne(flowRunId: Id) {
		return apiClient.get<FlowRun>(`/flow-runs/${flowRunId}`, {
			paramsSerializer: {
				indexes: null, // no brackets at all
			},
		})
	}

	static async getMany(query: FlowRunsGetManyQuery) {
		return apiClient.get<FlowRun[]>(`/flow-runs`, {
			paramsSerializer: {
				indexes: null, // no brackets at all
			},
			params: query,
		})
	}
}
