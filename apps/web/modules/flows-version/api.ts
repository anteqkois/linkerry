import { FlowVersion, Id, Trigger } from '@linkerry/shared'
import { apiClient } from '../../libs/api-client'

export class FlowVersionApi {
  // static async get(id: Id) {
  //   return apiClient.get<FlowVersion | null>(`/flow-versions/${id}`, {
  //     paramsSerializer: {
  //       indexes: null, // no brackets at all
  //     },
  //   })
  // }

  static async patch(id: Id, data: Partial<FlowVersion>) {
    return apiClient.patch<FlowVersion | undefined>(`/flow-versions/${id}`, data)
  }

  static async updateTrigger(id: Id, data: Partial<Trigger> & { name: string }) {
    return apiClient.patch<FlowVersion | undefined>(`/flow-versions/${id}/triggers`, data)
  }
}
