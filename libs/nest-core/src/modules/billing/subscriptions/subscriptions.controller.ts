import { Id } from '@linkerry/shared'
import { Controller, Get, Query } from '@nestjs/common'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	@Get()
	findMany() {
		return this.subscriptionsService.findMany()
	}

	@Get(':id')
	findOne(@Query('id') id: Id) {
		return this.subscriptionsService.findOne(id)
	}
}
