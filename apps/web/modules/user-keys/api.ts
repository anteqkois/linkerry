import { IUserKeysInput, IUserKeysResponse } from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class UserKeysApi {
  static async create(input: IUserKeysInput) {
    return apiClient.post<IUserKeysResponse>('/user-keys', input)
  }
}
