import { FlowPopulated, FlowPublishInput, Id, UpdateStatusInput } from '@linkerry/shared'
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

  static async patch(id: Id, flow: Partial<Omit<FlowPopulated, 'version'>>) {
    return apiClient.patch<FlowPopulated>(`/flows/${id}`)
  }

  static async publish(id: Id, body: FlowPublishInput) {
    return apiClient.patch<FlowPopulated>(`/flows/${id}/publish`, body)
  }

  static async changeStatus(id: Id, body: UpdateStatusInput) {
    return apiClient.patch<FlowPopulated>(`/flows/${id}/status`, body)
  }
}
