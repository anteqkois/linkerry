import { RunActionInput, TriggerEvent } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class StepApi {
	static async run(body: RunActionInput) {
		return apiClient.post<TriggerEvent[]>(`/actions/run`, body)
	}
}
