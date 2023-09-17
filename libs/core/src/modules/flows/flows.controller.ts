import { JwtUser } from '@market-connector/shared'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { CreateFlowDto } from './dto/create.dto'
import { FlowsService } from './flows.service'

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createEmptyFlow(@ReqJwtUser() user: JwtUser, @Body() dto: CreateFlowDto) {
    return this.flowsService.createEmpty(user.id)
  }
}
