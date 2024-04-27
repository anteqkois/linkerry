import { AppConnectionWithoutSensitiveData, Id, OAuth2AppEncrypted, UpsertAppConnectionInput } from '@linkerry/shared'
import { apiClient } from '../../libs/api-client'

export class AppConnectionsApi {
	static async upsert(body: UpsertAppConnectionInput) {
		return apiClient.post<AppConnectionWithoutSensitiveData>(`/app-connections`, body)
	}
	static async getMany() {
		return apiClient.get<AppConnectionWithoutSensitiveData[]>(`/app-connections`)
	}
	static async delete(appConnectionId: Id) {
		return apiClient.delete(`/app-connections/${appConnectionId}`)
	}
}

export class OAuth2Api {
	static async getManyApps() {
		return apiClient.get<Omit<OAuth2AppEncrypted, 'clientSecret'>[]>(`/oauth2/apps`)
	}
}
