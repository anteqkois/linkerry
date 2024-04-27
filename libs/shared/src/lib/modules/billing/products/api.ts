import { z } from 'zod';
import { Price, Product, ProductType } from './models';

export const findManyProductsQuerySchema = z.object({
	include: z.array(z.enum(['price'])).optional(),
	type: z.nativeEnum(ProductType).optional()
})
export interface FindManyProductsQuery extends z.infer<typeof findManyProductsQuerySchema> {}

export interface ProductWithPrices extends Product  { prices: Price[] }
