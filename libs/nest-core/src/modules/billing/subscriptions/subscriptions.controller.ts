import { ChangeSubscriptionBody, Id, RequestUser } from '@linkerry/shared'
import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common'
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
			project: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	findOne(@Query('id') id: Id) {
		return this.subscriptionsService.findOne({ _id: id })
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Put()
	change(@ReqJwtUser() user: RequestUser, @Body() body: ChangeSubscriptionBody) {
		// TODO check if it is owner or if it have privilages to start subscription when project members supported
		return this.subscriptionsService.change({ ...body, projectId: user.projectId })
	}
}
