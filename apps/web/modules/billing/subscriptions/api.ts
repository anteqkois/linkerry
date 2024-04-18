import { CreatePaidSubscriptionBody, SubscriptionPopulated } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class SubscriptionsApi {
	static async getMany() {
		return apiClient.get<SubscriptionPopulated[]>(`/subscriptions`)
	}

	static async create(body: CreatePaidSubscriptionBody) {
		return apiClient.post<any>(`/subscriptions`)
	}
}
