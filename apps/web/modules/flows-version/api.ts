import { FlowVersion, FlowVersionAddActionInput, Id, Trigger } from '@linkerry/shared'
import { apiClient } from '../../libs/api-client'

export class FlowVersionApi {
  static async patch(flowVersionId: Id, data: Partial<FlowVersion>) {
    return apiClient.patch<FlowVersion | undefined>(`/flow-versions/${flowVersionId}`, data)
  }

  static async updateTrigger(flowVersionId: Id, data: Partial<Trigger> & { name: string }) {
    return apiClient.patch<FlowVersion | undefined>(`/flow-versions/${flowVersionId}/triggers`, data)
  }

  static async addAction(flowVersionId: Id, data: FlowVersionAddActionInput) {
    return apiClient.post<FlowVersion>(`/flow-versions/${flowVersionId}/actions`, data)
  }
}
