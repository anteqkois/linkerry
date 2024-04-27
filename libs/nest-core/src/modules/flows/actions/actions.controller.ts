import { RequestUser, RunActionInput, runActionInputSchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { StrictRateLimit } from '../../../lib/nest-utils/decorators/stricy-rate-limit.decorator'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { ActionsService } from './actions.service'

@Controller('actions')
export class ActionsController {
	constructor(private readonly actionsService: ActionsService) {}

	@StrictRateLimit()
	@UseGuards(JwtCookiesAuthGuard)
	@Post('/run')
	create(@BodySchema(runActionInputSchema) body: RunActionInput, @ReqJwtUser() user: RequestUser) {
		return this.actionsService.run(user.projectId, user.id, body)
	}
}
