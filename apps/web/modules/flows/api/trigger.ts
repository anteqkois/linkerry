import { Flow, TriggerPoolTestBody } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class TriggerApi {
	static async poolTest(body: TriggerPoolTestBody) {
		return apiClient.post<Flow | null>(`/trigger-events/test/pool`, body)
	}
}
