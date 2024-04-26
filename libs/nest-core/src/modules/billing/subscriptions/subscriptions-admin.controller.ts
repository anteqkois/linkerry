import { Subscription } from '@linkerry/shared';
import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../lib/auth/guards/admin.guard';
import { SubscriptionsAdminService } from './subscriptions-admin.service';

@Controller('admin/subscriptions')
export class SubscriptionsAdminController {
	constructor(private readonly subscriptionsAdminService: SubscriptionsAdminService) {}

	@UseGuards(AdminGuard)
	@TypedRoute.Post()
	create(@TypedBody() body: Subscription) {
		return this.subscriptionsAdminService.create(body)
	}
}
