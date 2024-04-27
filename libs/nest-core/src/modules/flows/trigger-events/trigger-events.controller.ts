import { DeleteTriggerEventsInput, GetTriggerEventsQuery, RequestUser, TriggerPoolTestBody, deleteTriggerEventsInputSchema, getTriggerEventsQuerySchema, triggerPoolTestBodySchema } from '@linkerry/shared'
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { TriggerEventsService } from './trigger-events.service'

@Controller('trigger-events')
export class TriggerEventsController {
	constructor(private readonly triggerEventsService: TriggerEventsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	getTriggerEvents(@QuerySchema(getTriggerEventsQuerySchema) query: GetTriggerEventsQuery, @ReqJwtUser() user: RequestUser) {
		return this.triggerEventsService.getMany(query, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Delete()
	deleteTriggerEvents(@BodySchema(deleteTriggerEventsInputSchema) body: DeleteTriggerEventsInput, @ReqJwtUser() user: RequestUser) {
		return this.triggerEventsService.deleteMany(body, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post('/test/pool')
	create(@BodySchema(triggerPoolTestBodySchema) body: TriggerPoolTestBody, @ReqJwtUser() user: RequestUser) {
		return this.triggerEventsService.test(body, user.projectId, user.id)
	}
}
