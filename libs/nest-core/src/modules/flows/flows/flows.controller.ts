import { FlowPublishInput, Id, RequestUser, UpdateStatusInput } from '@linkerry/shared'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
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
		return this.flowsService.createEmpty(user.projectId, user.id)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Patch(':id/publish')
	publishFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: string, @Body() body: FlowPublishInput) {
		return this.flowsService.publish(id, user.projectId, user.id, body)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Patch(':id/status')
	changeStatusFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: string, @Body() body: UpdateStatusInput) {
		return this.flowsService.changeStatus(id, user.projectId, body)
	}

	// @UseGuards(JwtCookiesAuthGuard)
	// @Patch(':id/use-as-draft')
	// changeStatusFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: string, @Body() body: UpdateStatusInput) {
	// 	return this.flowsService.changeStatus(id, user.projectId, body)
	// }

	// @UseGuards(JwtCookiesAuthGuard)
	// @Patch(':id/lock')
	// changeStatusFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: string, @Body() body: UpdateStatusInput) {
	// 	return this.flowsService.changeStatus(id, user.projectId, body)
	// }
}
