import { DeleteTriggerEventsInput, GetManyTriggerEventsQuery, RequestUser, TriggerPoolTestBody } from '@linkerry/shared'
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { TriggerEventsService } from './trigger-events.service'

@Controller('trigger-events')
export class TriggerEventsController {
	constructor(private readonly triggerEventsService: TriggerEventsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	getTriggerEvents(@ReqJwtUser() user: RequestUser, @TypedQuery() query: GetManyTriggerEventsQuery) {
		return this.triggerEventsService.getMany(query, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Delete()
	deleteTriggerEvents(@ReqJwtUser() user: RequestUser, @TypedBody() body: DeleteTriggerEventsInput) {
		return this.triggerEventsService.deleteMany(body, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post('/test/pool')
	create(@ReqJwtUser() user: RequestUser, @TypedBody() body: TriggerPoolTestBody) {
		return this.triggerEventsService.test(body, user.projectId, user.id)
	}
}
