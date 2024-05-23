import { UsageResponse } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class UsageApi {
  static async getOne() {
    return apiClient.get<UsageResponse>(`/usage`)
  }
}
