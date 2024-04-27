import { Product, productSchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { ProductsService } from './products.service'

@Controller('admin/products')
export class ProductsAdminController {
	constructor(private readonly productsService: ProductsService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@BodySchema(productSchema) body: Product) {
		return this.productsService.create(body)
	}
}
