import { ChangeSubscriptionBody, ChangeSubscriptionResponse, SubscriptionPopulated } from '@linkerry/shared';
import { apiClient } from '../../../libs/api-client';

export class SubscriptionsApi {
	static async getMany() {
		return apiClient.get<SubscriptionPopulated[]>(`/subscriptions`)
	}

	static async change(body: ChangeSubscriptionBody) {
		return apiClient.post<ChangeSubscriptionResponse>(`/subscriptions`, body)
	}
}
