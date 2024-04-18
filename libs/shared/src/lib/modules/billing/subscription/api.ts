import { Id } from '../../../common'
import { SubscriptionPeriod } from './subscription'

export interface CreatePaidSubscriptionBody {
	items: {
		productId: Id
		priceId: Id
	}[]
	period: SubscriptionPeriod
}

export interface UpgradePaidSubscriptionBody {
	productIds: Id[]
}
