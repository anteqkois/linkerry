import { Id, RequestUser } from '@linkerry/shared'
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowsService } from './flows.service'

@Controller('flows')
export class FlowsController {
	constructor(private readonly flowsService: FlowsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	getFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: Id) {
		return this.flowsService.findOne({
			filter: {
				_id: id,
				projectId: user.projectId,
			},
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Delete(':id')
	delteFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: Id) {
		return this.flowsService.deleteOne(id, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	createEmptyFlow(@ReqJwtUser() user: RequestUser) {
		return this.flowsService.createEmpty(user.projectId)
	}
}
