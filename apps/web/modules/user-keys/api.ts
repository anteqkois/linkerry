import { IUserKeys_CreateInput, IUserKeys_CreateResponse } from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class UserKeysApi {
  static async create(input: IUserKeys_CreateInput) {
    return apiClient.post<IUserKeys_CreateResponse>('/user-keys', input)
  }
}
