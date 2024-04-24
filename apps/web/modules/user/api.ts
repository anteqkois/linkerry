import { IAuthLoginInput, IAuthLoginResponse, IAuthLogoutResponse, IAuthSignUpInput, IAuthSignUpResponse, User } from '@linkerry/shared'
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
		return apiClient.post<IAuthSignUpResponse>('/auth/signup', input)
	}

	static async logout() {
		return apiClient.post<IAuthLogoutResponse>('/auth/logout')
	}

	static async verifyEmailCode(code: string) {
		return apiClient.post<User>('/auth/email/verify', {
			code,
		})
	}

	static async resendEmailCode() {
		return apiClient.post<User>('/auth/email/resend')
	}
}

export class UserApi {
	static async liveChatHash() {
		return apiClient.get(
			'/users/live-chat',
			// fingerprint: await fingerprint,
		)
	}
}
