import { Id, Product } from '@linkerry/shared'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() body: Product) {
		return this.productsService.create(body)
	}

	@Get()
	findMany() {
		return this.productsService.findMany()
	}

	@Get(':id')
	findOne(@Query('id') id: Id) {
		return this.productsService.findOne(id)
	}
}
