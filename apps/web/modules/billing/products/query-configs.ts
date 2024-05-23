import { FindManyProductsQuery, ProductWithPrices } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { ProductsApi } from './api'

export const productsQueryConfig = {
  getManyWithPrices: (query: FindManyProductsQuery): UseQueryOptions<ProductWithPrices[]> => {
    return {
      queryKey: ['products', ...Object.values(query)],
      queryFn: async () => (await ProductsApi.getManyWithPrices(query)).data,
    }
  },
}
