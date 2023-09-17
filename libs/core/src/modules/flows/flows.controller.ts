import { Body, Controller, Post } from '@nestjs/common'
import { FlowsService } from './flows.service'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { JwtUser } from '@market-connector/types'
import { CreateFlowDto } from './dto/create.dto'

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Post()
  createEmptyFlow(@ReqJwtUser() user: JwtUser, @Body() dto: CreateFlowDto) {
    return this.flowsService.createEmpty(user.id)
  }
}
