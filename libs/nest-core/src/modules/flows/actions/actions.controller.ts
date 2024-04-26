import { RequestUser, RunActionInput } from '@linkerry/shared'
import { TypedBody, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { ActionsService } from './actions.service'

@Controller('actions')
export class ActionsController {
	constructor(private readonly actionsService: ActionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post('/run')
	create(@ReqJwtUser() user: RequestUser, @TypedBody() boody: RunActionInput) {
		return this.actionsService.run(user.projectId, user.id, boody)
	}
}
