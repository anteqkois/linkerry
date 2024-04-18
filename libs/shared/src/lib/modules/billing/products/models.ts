import { DatabaseTimestamp, Id } from '../../../common'
import { SubscriptionPeriod } from '../subscription'
import { PlanProductConfiguration } from './planProductConfiguration'
export * from './planProductConfiguration'

// [Free, Baisc, Professional, Enterprise]
export enum ProductType {
	PLAN = 'PLAN',
}

export interface StripePrice {
	id: string
}

export interface Price extends DatabaseTimestamp{
	_id: string
	price: number
	period: SubscriptionPeriod
	default: boolean
	visible: boolean
	priority: number
	productId: Id
	stripe: StripePrice
	currencyCode: string
}

export interface StripeProduct {
	id: string
}

export interface Product extends DatabaseTimestamp  {
	_id: Id
	name: string
	shortDescription: string
	type: ProductType
	config: PlanProductConfiguration
	priority: number
	visible: boolean
	//  comparisionId ???
	stripe: StripeProduct
}
