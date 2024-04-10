import { Subscription } from '@linkerry/shared'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { SubscriptionsService } from './subscriptions.service'

@Controller('admin/subscriptions')
export class SubscriptionsAdminController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() body: Subscription) {
		return this.subscriptionsService.create(body)
	}
}
