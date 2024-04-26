import { Id, RequestUser } from '@linkerry/shared'
import { TypedParam, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowVersionsService } from './flow-versions.service'

@Controller('flow-versions')
export class FlowVersionsController {
	constructor(private readonly flowVersionsService: FlowVersionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get(':id')
	getOne(@ReqJwtUser() user: RequestUser, @TypedParam('id') id: Id) {
		return this.flowVersionsService.findOne({
			filter: {
				_id: id,
				projectId: user.projectId,
			},
		})
	}
}
