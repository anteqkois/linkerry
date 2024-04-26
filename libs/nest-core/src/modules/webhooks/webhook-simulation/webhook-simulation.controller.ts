import { CreateWebhookSimulationInput, DeleteWebhookSimulationInput, GetWebhookSimulationQuery, RequestUser } from '@linkerry/shared'
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { WebhookSimulationService } from './webhook-simulation.service'

@Controller('webhook-simulation')
export class WebhookSimulationController {
	constructor(private readonly webhookSimulationService: WebhookSimulationService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	findOne(@ReqJwtUser() user: RequestUser, @TypedQuery() query: GetWebhookSimulationQuery) {
		this.webhookSimulationService.get({
			flowId: query.flowId,
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post()
	create(@ReqJwtUser() user: RequestUser, @TypedBody() body: CreateWebhookSimulationInput) {
		this.webhookSimulationService.create({
			flowId: body.flowId,
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Delete()
	delete(@ReqJwtUser() user: RequestUser, @TypedBody() body: DeleteWebhookSimulationInput) {
		this.webhookSimulationService.delete({
			flowId: body.flowId,
			projectId: user.projectId,
		})
	}
}
