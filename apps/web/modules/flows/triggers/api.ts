import { DeleteTriggerEventsInput, GetTriggerEventsQuery, TriggerEvent, TriggerPoolTestBody } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class TriggerApi {
	static async poolTest(body: TriggerPoolTestBody) {
		return apiClient.post<TriggerEvent[]>(`/trigger-events/test/pool`, body)
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
