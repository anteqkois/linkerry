import { FindManyProductsQuery, ProductWithPrices } from '@linkerry/shared'
import { apiClient } from '../../../libs/api-client'

export class ProductsApi {
	static async getManyWithPrices(query: FindManyProductsQuery) {
		return apiClient.get<ProductWithPrices[]>(`/products`, { params: query })
	}
}
