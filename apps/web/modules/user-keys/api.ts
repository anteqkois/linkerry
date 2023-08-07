import { IUserKeysCreateInput, IUserKeysCreateResponse } from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class UserKeysApi {
  static async create(input: IUserKeysCreateInput) {
    return apiClient.post<IUserKeysCreateResponse>('/user-keys', input)
  }
}
