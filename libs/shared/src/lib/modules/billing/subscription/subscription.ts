import { tags } from 'typia'
import { DatabaseTimestamp, Id } from '../../../common'
import { Price, Product } from '../products'
import { StripeSubscriptionId } from '../stripe/type-validators'
import { DateType } from '../../../common/type-validators'

export enum SubscriptionPeriod {
	MONTHLY = 'monthly',
	QUARTERLY = 'quarterly',
	YEARLY = 'yearly',
}

/* store status etc data in our db insted only in Stripe to have ability to change paymnet way when user wants to edit incomplete subscription */
export enum SubscriptionStatus {
	ACTIVE = 'active',
	INCOMPLETE = 'incomplete',
	INCOMPLETE_EXPIRED = 'incomplete_expired',
	PAST_DUE = 'past_due',
	CANCELED = 'canceled',
	UNAPID = 'unpaid',
}
export enum PaymentGateway {
	NONE = 'NONE',
	STRIPE = 'STRIPE',
}

export interface SubscriptionItem {
	product: Id
	price: Id
}

export interface SubscriptionCommonFields extends DatabaseTimestamp {
	_id: Id
	project: Id
	items: Array<SubscriptionItem> & tags.MinItems<1> & tags.MaxItems<10>
	status: SubscriptionStatus
	validTo: DateType
	canceledAt?: DateType
	trialStartedAt?: DateType
	trialEndedAt?: DateType
	period: SubscriptionPeriod
}

export interface SubscriptionBlank extends SubscriptionCommonFields {
	paymentGateway: PaymentGateway.NONE
}

export interface SubscriptionStripe extends SubscriptionCommonFields {
	paymentGateway: PaymentGateway.STRIPE
	stripeSubscriptionId: StripeSubscriptionId
	validTo: DateType
	defaultPaymentMethod: null
}

export type Subscription = SubscriptionBlank | SubscriptionStripe
export type SubscriptionPopulated = Omit<SubscriptionBlank | SubscriptionStripe, 'items'> & {
	items: {
		product: Product
		price: Price
	}[]
}

export interface SubscriptionHistory {
	_id: Id
	subscriptionId: Id
	products: Id[]
	startedAt: string
	endedAt?: string
}
