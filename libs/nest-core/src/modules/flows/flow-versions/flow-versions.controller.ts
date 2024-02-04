import { Action, FlowVersionAddActionInput, Id, RequestUser, Trigger } from '@linkerry/shared'
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../../lib/auth/decorators/req-user.decorator'
import { FlowVersionsService } from './flow-versions.service'

@Controller('flow-versions')
export class FlowVersionsController {
	constructor(private readonly flowVersionsService: FlowVersionsService) {}

	@UseGuards(JwtAuthGuard)
	@Patch(':id/triggers')
	updateFlowTrigger(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: Trigger) {
		return this.flowVersionsService.updateTrigger(id, user.id, body)
	}

	@UseGuards(JwtAuthGuard)
	@Post(':id/actions')
	addFlowAction(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: FlowVersionAddActionInput) {
		return this.flowVersionsService.addAction(id, user.id, body)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id/actions')
	updateFlowAction(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: Action) {
		return this.flowVersionsService.updateAction(id, user.id, body)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id/actions/:actionName')
	deleteFlowAction(@ReqJwtUser() user: RequestUser, @Param('id') id: Id,@Param('actionName') actionName: string) {
		return this.flowVersionsService.deleteAction(id, user.id, actionName)
	}
}
