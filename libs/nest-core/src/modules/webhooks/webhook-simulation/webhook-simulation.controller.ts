import { CreateWebhookSimulationInput, DeleteWebhookSimulationInput, GetWebhookSimulationQuery, RequestUser } from '@linkerry/shared'
import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { WebhookSimulationService } from './webhook-simulation.service'

@Controller('webhook-simulation')
export class WebhookSimulationController {
	constructor(private readonly webhookSimulationService: WebhookSimulationService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	findOne(@ReqJwtUser() user: RequestUser, @Query() query: GetWebhookSimulationQuery) {
		this.webhookSimulationService.get({
			flowId: query.flowId,
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	create(@ReqJwtUser() user: RequestUser, @Body() body: CreateWebhookSimulationInput) {
		this.webhookSimulationService.create({
			flowId: body.flowId,
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Delete()
	delete(@ReqJwtUser() user: RequestUser, @Body() body: DeleteWebhookSimulationInput) {
		this.webhookSimulationService.delete({
			flowId: body.flowId,
			projectId: user.projectId,
		})
	}
}
