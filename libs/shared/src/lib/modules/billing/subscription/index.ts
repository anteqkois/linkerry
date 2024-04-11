import { Id } from '../../../common'
import { Product } from '../products'

export enum SubscriptionPeriod {
	MONTHLY = 'monthly',
	QUARTERLY = 'quarterly',
	YEARLY = 'yearly',
}
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

export interface SubscriptionCommonFields {
	_id: Id
	projectId: Id
	products: Id[]
	subscriptionStatus: SubscriptionStatus
	validTo: string
	currentPeriodEnd: string
	canceledAt?: string
	trialStartedAt?: string
	trialEndedAt?: string
	period: SubscriptionPeriod
}

export interface SubscriptionBlank extends SubscriptionCommonFields {
	paymentGateway: PaymentGateway.NONE
}

export interface SubscriptionStripe extends SubscriptionCommonFields {
	paymentGateway: PaymentGateway.STRIPE
	stripeSubscriptionId: string
	validTo: string
	currentPeriodEnd: string
	defaultPaymentMethod: null
}

export type Subscription = SubscriptionBlank | SubscriptionStripe
export type SubscriptionPopulated = Omit<SubscriptionBlank | SubscriptionStripe, 'products'> & {
	products: Product[]
}

export interface SubscriptionHistory {
	_id: Id
	subscriptionId: Id
	products: Id[]
	startedAt: string
	endedAt?: string
}
