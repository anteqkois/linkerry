import { FlowPublishInput, Id, PopulatedFlow } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class FlowApi {
  static async get(id: Id) {
    return apiClient.get<PopulatedFlow | null>(`/flows/${id}`, {
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
    return apiClient.post<PopulatedFlow>('/flows')
  }

  static async patch(id: Id, flow: Partial<Omit<PopulatedFlow, 'version'>>) {
    return apiClient.patch<PopulatedFlow>(`/flows/${id}`)
  }

  static async publish(id: Id, body: FlowPublishInput) {
    return apiClient.patch<PopulatedFlow>(`/flows/${id}/publish`, body)
  }
}
