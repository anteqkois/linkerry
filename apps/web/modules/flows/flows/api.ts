import { Flow, Id } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class FlowApi {
  static async get(id: Id) {
    return apiClient.get<Flow | null>(`/flows/${id}`, {
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
    return apiClient.post<Flow>('/flows')
  }

  static async patch(id: Id, flow: Partial<Omit<Flow, 'version'>>) {
    return apiClient.patch<Flow>(`/flows/${id}`)
  }
}
