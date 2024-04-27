import { ChangeSubscriptionBody, Id, RequestUser, changeSubscriptionBodySchema } from '@linkerry/shared'
import { Controller, Get, Put, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { ParamIdSchema } from '../../../lib/nest-utils/decorators/zod/id'
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
	findOne(@ParamIdSchema() id: Id) {
		return this.subscriptionsService.findOne({ _id: id })
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Put()
	change(@BodySchema(changeSubscriptionBodySchema) body: ChangeSubscriptionBody, @ReqJwtUser() user: RequestUser) {
		// TODO check if it is owner or if it have privilages to start subscription when project members supported
		return this.subscriptionsService.change({ ...body, projectId: user.projectId })
	}
}
