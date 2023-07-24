// import { SignUpDto } from '@market-connector/core'
import { apiClient } from '../../libs/api-client'

export type LoginInput = {
  email: string
  password: string
}

export class AuthApi {
  static async login(input: LoginInput) {
    return apiClient.post<{}>('/auth/login', {
      input,
      // fingerprint: await fingerprint,
    })
  }

  // static async signUp(input: SignUpDto) {
  //   return apiClient.post<{}>('/auth/signup', {
  //     input,
  //     // fingerprint: await fingerprint,
  //   })
  // }
}
