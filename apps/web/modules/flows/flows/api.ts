import { FlowOperationRequest, FlowPopulated, Id } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class FlowApi {
	static async get(id: Id) {
		return apiClient.get<FlowPopulated | null>(`/flows/${id}`, {
			paramsSerializer: {
				indexes: null, // no brackets at all
			},
		})

		// return apiClient.get<IStrategy_GetOneResponse<'strategyBuy.strategyBuy'>>(`/strategies/${id}`, {
		//   params: query,
		//   paramsSerializer: {
		//     indexes: null, // no brackets at all
		//   },
		// })
	}

	static async create() {
		return apiClient.post<FlowPopulated>('/flows')
	}

	static async operation(id: Id, body: FlowOperationRequest) {
		return apiClient.patch<FlowPopulated>(`/flows/${id}`, body)
	}
}
