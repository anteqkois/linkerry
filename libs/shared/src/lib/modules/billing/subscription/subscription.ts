import { z } from 'zod'
import { BaseDatabaseFields } from '../../../common'
import { idSchema, stringDateSchema, stringShortSchema } from '../../../common/zod'
import { Price, Product } from '../products'

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

const subscriptionItemSchema = z.object({
	product: idSchema,
	price: idSchema,
})
export interface SubscriptionItem extends z.infer<typeof subscriptionItemSchema> {}

const subscriptionCommonFieldsSchema = z.object({
	project: idSchema,
	items: z.array(subscriptionItemSchema).min(1).max(10),
	status: z.nativeEnum(SubscriptionStatus),
	validTo: stringDateSchema,
	canceledAt: stringDateSchema.optional(),
	trialStartedAt: stringDateSchema.optional(),
	trialEndedAt: stringDateSchema.optional(),
	period: z.nativeEnum(SubscriptionPeriod),
})
export interface SubscriptionCommonFields extends BaseDatabaseFields, z.infer<typeof subscriptionCommonFieldsSchema> {}

const subscriptionBlankSchema = subscriptionCommonFieldsSchema.merge(
	z.object({
		paymentGateway: z.enum([PaymentGateway.NONE]),
	}),
)
export interface SubscriptionBlank extends BaseDatabaseFields, z.infer<typeof subscriptionBlankSchema> {}

const subscriptionStripeSchema = subscriptionCommonFieldsSchema.merge(
	z.object({
		paymentGateway: z.enum([PaymentGateway.STRIPE]),
		stripeSubscriptionId: stringShortSchema,
		validTo: stringDateSchema,
		defaultPaymentMethod: z.null().optional(),
	}),
)
export interface SubscriptionStripe extends BaseDatabaseFields, z.infer<typeof subscriptionStripeSchema> {}

export const subscriptionSchema = z.union([subscriptionBlankSchema, subscriptionStripeSchema])
export type Subscription = z.infer<typeof subscriptionSchema>
export type SubscriptionPopulated = Omit<SubscriptionBlank | SubscriptionStripe, 'items'> & {
	items: {
		product: Product
		price: Price
	}[]
}
