import { CreatePaidSubscriptionBody, Id, RequestUser } from '@linkerry/shared'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	findMany(@ReqJwtUser() user: RequestUser) {
		return this.subscriptionsService.findMany({
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	findOne(@Query('id') id: Id) {
		return this.subscriptionsService.findOne({ _id: id })
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	createPaidSubscription(@ReqJwtUser() user: RequestUser, @Body() body: CreatePaidSubscriptionBody) {
		// TODO check if it is owner or if it have privilages to start subscription when project members supported

		return this.subscriptionsService.createPaidSubscription({
			...body,
			projectId: user.projectId,
		})
	}
}
