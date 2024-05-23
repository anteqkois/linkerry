import {
  CreateWebhookSimulationInput,
  DeleteWebhookSimulationInput,
  GetWebhookSimulationQuery,
  RequestUser,
  createWebhookSimulationInputSchema,
  deleteWebhookSimulationInputSchema,
  getWebhookSimulationQuerySchema,
} from '@linkerry/shared'
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query.decorator'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { WebhookSimulationService } from './webhook-simulation.service'

@Controller('webhook-simulation')
export class WebhookSimulationController {
  constructor(private readonly webhookSimulationService: WebhookSimulationService) {}

  @UseGuards(JwtCookiesAuthGuard)
  @Get()
  findOne(@QuerySchema(getWebhookSimulationQuerySchema) query: GetWebhookSimulationQuery, @ReqJwtUser() user: RequestUser) {
    this.webhookSimulationService.get({
      flowId: query.flowId,
      projectId: user.projectId,
    })
  }

  @UseGuards(JwtCookiesAuthGuard)
  @Post()
  create(@BodySchema(createWebhookSimulationInputSchema) body: CreateWebhookSimulationInput, @ReqJwtUser() user: RequestUser) {
    this.webhookSimulationService.create({
      flowId: body.flowId,
      projectId: user.projectId,
    })
  }

  @UseGuards(JwtCookiesAuthGuard)
  @Delete()
  delete(@BodySchema(deleteWebhookSimulationInputSchema) body: DeleteWebhookSimulationInput, @ReqJwtUser() user: RequestUser) {
    this.webhookSimulationService.delete({
      flowId: body.flowId,
      projectId: user.projectId,
    })
  }
}
