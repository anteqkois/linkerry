import { AppConnectionWithoutSensitiveData, UpsertAppConnectionInput } from '@linkerry/shared'
import { apiClient } from '../../libs/api-client'

export class AppConnectionsApi {
	static async upsert(body: UpsertAppConnectionInput) {
		return apiClient.post<AppConnectionWithoutSensitiveData>(`/app-connections`, body)
	}
	static async getMany() {
		return apiClient.get<AppConnectionWithoutSensitiveData[]>(`/app-connections`)
	}
}