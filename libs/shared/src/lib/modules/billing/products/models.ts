import { DatabaseTimestamp, Id } from '../../../common'
import { ShortStringType } from '../../../common/type-validators'
import { SubscriptionPeriod } from '../subscription'
import { PlanProductConfiguration } from './planProductConfiguration'
export * from './planProductConfiguration'

// [Free, Baisc, Professional, Enterprise]
export enum ProductType {
	PLAN = 'PLAN',
}

export interface StripePrice {
	id: ShortStringType
}

export interface Price extends DatabaseTimestamp {
	_id: Id
	price: number
	period: SubscriptionPeriod
	default: boolean
	visible: boolean
	priority: number
	productId: Id
	stripe: StripePrice
	currencyCode: ShortStringType<10>
}

export interface StripeProduct {
	id: ShortStringType
}

export interface Product extends DatabaseTimestamp {
	_id: Id
	name: ShortStringType
	shortDescription: ShortStringType
	type: ProductType
	config: PlanProductConfiguration
	priority: number
	visible: boolean
	//  comparisionId ???
	stripe: StripeProduct
}

export type PlanName = 'Free' | 'Basic' | 'Professional' | 'Enterprise'
