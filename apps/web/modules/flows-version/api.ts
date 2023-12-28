import { Trigger } from '@market-connector/shared'
import { apiClient } from '../../libs/api-client'

export class FlowVersionApi {
  // static async get(id: Id) {
  //   return apiClient.get<FlowVersion | null>(`/flow-versions/${id}`, {
  //     paramsSerializer: {
  //       indexes: null, // no brackets at all
  //     },
  //   })
  // }

  static async updateTrigger(data: Partial<Trigger>) {
    return apiClient.put('/flow-versions/triggers', data)
  }
}
