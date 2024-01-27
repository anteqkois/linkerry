import { Id, RequestUser, Trigger, TriggerType, triggerConnectorSchema, triggerEmptySchema, triggerWebhookSchema } from '@linkerry/shared'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../../lib/auth/decorators/req-user.decorator'
import { UpdateTriggerBaseDto } from './dto/update-trigger.dto'
import { FlowVersionsService } from './flow-versions.service'

@Controller('flow-versions')
export class FlowVersionsController {
  constructor(private readonly flowVersionsService: FlowVersionsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id/triggers')
  updateFlowTrigger(@ReqJwtUser() user: RequestUser, @Param('id') id: Id, @Body() body: Trigger) {
    return this.flowVersionsService.updateTrigger(id, user.id, body)
  }
}
