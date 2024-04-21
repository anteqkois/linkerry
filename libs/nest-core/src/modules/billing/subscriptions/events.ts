import { Id, Subscription } from '@linkerry/shared'

export interface SubscriptionUpdate {
	id: Id
	data: Partial<Subscription>
}
