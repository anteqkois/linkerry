import { Id } from '../../../common'
import { SubscriptionPeriod } from './subscription'

export interface ChangeSubscriptionBody {
	items: {
		productId: Id
		priceId: Id
	}[]
	period: SubscriptionPeriod
}
export interface ChangeSubscriptionResponse {
	checkoutUrl: string
}
