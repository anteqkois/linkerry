import { RunActionInput, RunActionResponse } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class StepApi {
  static async run(body: RunActionInput) {
    return apiClient.post<RunActionResponse>(`/actions/run`, body)
  }
}
