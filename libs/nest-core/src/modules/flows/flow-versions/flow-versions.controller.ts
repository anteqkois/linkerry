import { Action, FlowVersionAddActionInput, Id, RequestUser, Trigger } from '@linkerry/shared'
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowVersionsService } from './flow-versions.service'

@Controller('flow-versions')
export class FlowVersionsController {
	constructor(private readonly flowVersionsService: FlowVersionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Patch(':id/triggers')
	updateFlowTrigger(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: Trigger) {
		return this.flowVersionsService.updateTrigger(id, user.projectId, user.id, body)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post(':id/actions')
	addFlowAction(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: FlowVersionAddActionInput) {
		return this.flowVersionsService.addAction(id, user.projectId, user.id, body)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Patch(':id/actions')
	updateFlowAction(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: Action) {
		return this.flowVersionsService.updateAction(id, user.projectId, user.id, body)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Delete(':id/actions/:actionName')
	deleteFlowAction(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Param('actionName') actionName: string) {
		return this.flowVersionsService.deleteAction(id, user.projectId, user.id, actionName)
	}
}
