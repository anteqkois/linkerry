import { Product } from '@linkerry/shared'
import { TypedBody, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { ProductsService } from './products.service'

@Controller('admin/products')
export class ProductsAdminController {
	constructor(private readonly productsService: ProductsService) {}

	@UseGuards(AdminGuard)
	@TypedRoute.Post()
	create(@TypedBody() body: Omit<Product, '_id'>) {
		return this.productsService.create(body)
	}
}
