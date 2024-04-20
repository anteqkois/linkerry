import { Subscription } from '@linkerry/shared'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { SubscriptionsAdminService } from './subscriptions-admin.service'

@Controller('admin/subscriptions')
export class SubscriptionsAdminController {
	constructor(private readonly subscriptionsAdminService: SubscriptionsAdminService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() body: Subscription) {
		return this.subscriptionsAdminService.create(body)
	}
}
