import { RequestUser, RunActionInput, runActionInputSchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { ActionsService } from './actions.service'

@Controller('actions')
export class ActionsController {
	constructor(private readonly actionsService: ActionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Post('/run')
	create(@BodySchema(runActionInputSchema) body: RunActionInput, @ReqJwtUser() user: RequestUser) {
		return this.actionsService.run(user.projectId, user.id, body)
	}
}
