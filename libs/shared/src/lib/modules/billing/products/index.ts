import { Id } from '../../../common'
import { SubscriptionPeriod } from '../subscription'
import { ProductConfig, ProductConfigItem } from './config'
export * from './config'

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
	currencyCode: string
}

export interface Product {
	_id: Id
	name: string
	type: ProductType
	config: ProductConfig
	priority: number
	visible: boolean
	//  comparisionId ???
	// prices []
	stripeProductId: string
}

export interface ProductView extends Omit<Product, 'config'> {
	config: Record<keyof ProductConfig, ProductConfigItem>
}
