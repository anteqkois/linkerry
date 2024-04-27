import { z } from 'zod'
import { BaseDatabaseFields } from '../../../common'
import { idSchema, stringShortSchema } from '../../../common/zod'
import { SubscriptionPeriod } from '../subscription'
import { planProductConfigurationSchema } from './planProductConfiguration'
export * from './planProductConfiguration'

// [Free, Baisc, Professional, Enterprise]
export enum ProductType {
	PLAN = 'PLAN',
}

const stripePriceSchema = z.object({
	id: stringShortSchema,
})
export interface StripePrice extends z.infer<typeof stripePriceSchema> {}

export const priceSchema = z.object({
	price: z.number(),
	period: z.nativeEnum(SubscriptionPeriod),
	default: z.boolean(),
	visible: z.boolean(),
	priority: z.number(),
	productId: idSchema,
	stripe: stripePriceSchema,
	currencyCode: z.string().max(10),
})
export interface Price extends BaseDatabaseFields, z.infer<typeof priceSchema> {}

const stripeProductSchema = z.object({
	id: stringShortSchema,
})
export interface StripeProduct extends z.infer<typeof stripeProductSchema> {}

export const productSchema = z.object({
	name: stringShortSchema,
	shortDescription: stringShortSchema,
	type: z.nativeEnum(ProductType),
	config: planProductConfigurationSchema,
	priority: z.number(),
	visible: z.boolean(),
	//  comparisionId ???
	stripe: stripeProductSchema,
})
export interface Product extends BaseDatabaseFields, z.infer<typeof productSchema> {}

export type PlanName = 'Free' | 'Basic' | 'Professional' | 'Enterprise'
