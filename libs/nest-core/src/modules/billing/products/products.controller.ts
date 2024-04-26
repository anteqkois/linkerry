import { FindManyProductsQuery, Id } from '@linkerry/shared'
import { TypedQuery, TypedRoute } from '@nestia/core'
import { Controller } from '@nestjs/common'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@TypedRoute.Get()
	findMany(@TypedQuery() query: FindManyProductsQuery) {
		return this.productsService.findMany(query)
	}

	@TypedRoute.Get(':id')
	findOne(@TypedQuery() query: { id: Id }) {
		return this.productsService.findOne(query.id)
	}
}
