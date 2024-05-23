import { DeleteTriggerEventsInput, GetTriggerEventsQuery, TriggerEvent, TriggerPoolTestBody, TriggerTestPoolResponse } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class TriggerApi {
  static async poolTest(body: TriggerPoolTestBody) {
    return apiClient.post<TriggerTestPoolResponse>(`/trigger-events/test/pool`, body)
  }

  static async getTriggerEvents(params: GetTriggerEventsQuery) {
    return apiClient.get<TriggerEvent[]>(`/trigger-events`, {
      params,
    })
  }

  static async deleteAllTriggerEvents(body: DeleteTriggerEventsInput) {
    return apiClient.delete<TriggerEvent[]>(`/trigger-events`, { data: body })
  }
}
