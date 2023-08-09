import {
    IAuthLoginInput,
    IAuthLoginResponse,
    IAuthLogoutResponse,
    IAuthSignUpInput,
    IAuthSignUpResponse,
} from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class AuthApi {
  static async login(input: IAuthLoginInput) {
    return apiClient.post<IAuthLoginResponse>(
      '/auth/login',
      input,
      // fingerprint: await fingerprint,
    )
  }

  static async signUp(input: IAuthSignUpInput) {
    return apiClient.post<IAuthSignUpResponse>(
      '/auth/signup',
      input,
      // fingerprint: await fingerprint,
    )
  }

  static async logout() {
    return apiClient.post<IAuthLogoutResponse>(
      '/auth/logout',
      // fingerprint: await fingerprint,
    )
  }
}
