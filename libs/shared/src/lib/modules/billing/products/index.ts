import { Id } from '../../../common'
import { SubscriptionPeriod } from '../subscription'
import { PlanProductConfiguration, ProductConfigItem } from './planProductConfiguration'
export * from './planProductConfiguration'

// [Free, Baisc, Professional, Enterprise]
export enum ProductType {
	PLAN = 'PLAN',
}

export interface Price {
	_id: string
	price: number
	period: SubscriptionPeriod
	default: boolean
	visible: boolean
	priority: number
	productId: Id
	stripeId: string,
	currencyCode: string
}

export interface Product {
	_id: Id
	name: string
	type: ProductType
	config: PlanProductConfiguration
	priority: number
	visible: boolean
	//  comparisionId ???
	stripeProductId: string
}

export interface ProductView extends Omit<Product, 'config'> {
	config: Record<keyof PlanProductConfiguration, ProductConfigItem>
}
