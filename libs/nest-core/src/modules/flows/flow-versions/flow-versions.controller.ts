import { Id, RequestUser } from '@linkerry/shared'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ParamIdSchema } from '../../../lib/nest-utils/decorators/zod/id'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowVersionsService } from './flow-versions.service'

@Controller('flow-versions')
export class FlowVersionsController {
	constructor(private readonly flowVersionsService: FlowVersionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	getOne(@ParamIdSchema() id: Id, @ReqJwtUser() user: RequestUser) {
		return this.flowVersionsService.findOne({
			filter: {
				_id: id,
				projectId: user.projectId,
			},
		})
	}
}
