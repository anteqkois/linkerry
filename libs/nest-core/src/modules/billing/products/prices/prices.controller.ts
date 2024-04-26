import { Id } from '@linkerry/shared'
import { TypedQuery, TypedRoute } from '@nestia/core'
import { Controller } from '@nestjs/common'
import { PricesService } from './prices.service'

@Controller('prices')
export class PricesController {
	constructor(private readonly pricesService: PricesService) {}

	@TypedRoute.Get()
	findMany() {
		return this.pricesService.findMany()
	}

	@TypedRoute.Get(':id')
	findOne(@TypedQuery() query: { id: Id }) {
		return this.pricesService.findOne(query.id)
	}
}
