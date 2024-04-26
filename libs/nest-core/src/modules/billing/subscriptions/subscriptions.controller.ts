import { ChangeSubscriptionBody, Id, RequestUser } from '@linkerry/shared'
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	findMany(@ReqJwtUser() user: RequestUser) {
		return this.subscriptionsService.findMany({
			project: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get(':id')
	findOne(@TypedQuery() query: { id: Id }) {
		return this.subscriptionsService.findOne({ _id: query.id })
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post()
	change(@ReqJwtUser() user: RequestUser, @TypedBody() body: ChangeSubscriptionBody) {
		// TODO check if it is owner or if it have privilages to start subscription when project members supported
		return this.subscriptionsService.change({ ...body, projectId: user.projectId })
	}
}
