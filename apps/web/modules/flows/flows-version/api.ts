import { FlowVersion, Id } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class FlowVersionApi {
  static async getOne(flowVersionId: Id) {
    return apiClient.get<FlowVersion | undefined>(`/flow-versions/${flowVersionId}`)
  }

  static async patch(flowVersionId: Id, data: Partial<FlowVersion>) {
    return apiClient.patch<FlowVersion | undefined>(`/flow-versions/${flowVersionId}`, data)
  }
}
