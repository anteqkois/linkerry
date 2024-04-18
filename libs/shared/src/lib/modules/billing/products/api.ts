import { Price, Product, ProductType } from '.'

export interface FindManyProductsQuery {
	include?: 'price'[]
	type?: ProductType
}

export interface ProductWithPrices extends Product  { prices: Price[] }
