import { Subscription, subscriptionSchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { SubscriptionsAdminService } from './subscriptions-admin.service'

@Controller('admin/subscriptions')
export class SubscriptionsAdminController {
	constructor(private readonly subscriptionsAdminService: SubscriptionsAdminService) {}

	@UseGuards(AdminGuard)
	@Post()
	create(@BodySchema(subscriptionSchema) body: Subscription) {
		return this.subscriptionsAdminService.create(body)
	}
}
