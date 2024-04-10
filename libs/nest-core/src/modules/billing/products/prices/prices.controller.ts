import { Id, Price } from '@linkerry/shared'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../../lib/auth/guards/admin.guard'
import { PricesService } from './prices.service'

@Controller('prices')
export class PricesController {
	constructor(private readonly pricesService: PricesService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() body: Price) {
		return this.pricesService.create(body)
	}

	@Get()
	findMany() {
		return this.pricesService.findMany()
	}

	@Get(':id')
	findOne(@Query('id') id: Id) {
		return this.pricesService.findOne(id)
	}
}
