import { FindManyProductsQuery, Id, findManyProductsQuerySchema } from '@linkerry/shared'
import { Controller, Get } from '@nestjs/common'
import { ParamIdSchema } from '../../../lib/nest-utils/decorators/zod/id.decorator'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query.decorator'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findMany(@QuerySchema(findManyProductsQuerySchema) query: FindManyProductsQuery) {
		return this.productsService.findMany(query)
	}

	@Get(':id')
	findOne(@ParamIdSchema() id: Id) {
		return this.productsService.findOne(id)
	}
}
