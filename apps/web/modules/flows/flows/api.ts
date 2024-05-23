import { FlowGetManyQuery, FlowOperationRequest, FlowPopulated, Id } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class FlowApi {
  static async get(id: Id) {
    return apiClient.get<FlowPopulated | null>(`/flows/${id}`, {
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
  }

  static async getMany(query: FlowGetManyQuery) {
    return apiClient.get<FlowPopulated[]>(`/flows`, {
      params: query,
      paramsSerializer: {
        indexes: null,
      },
    })
  }

  static async create() {
    return apiClient.post<FlowPopulated>('/flows')
  }

  static async delete(flowId: Id) {
    return apiClient.delete<FlowPopulated>(`/flows/${flowId}`)
  }

  static async operation(id: Id, body: FlowOperationRequest) {
    return apiClient.patch<FlowPopulated>(`/flows/${id}`, body)
  }
}
