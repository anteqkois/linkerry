import { Id, JwtUser } from '@market-connector/shared'
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { CreateFlowDto } from './dto/create.dto'
import { FlowsService } from './flows.service'

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getFlow(@ReqJwtUser() user: JwtUser, @Param('id') id: Id) {
    return this.flowsService.findOne(id, user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createEmptyFlow(@ReqJwtUser() user: JwtUser, @Body() dto: CreateFlowDto) {
    return this.flowsService.createEmpty(user.id, dto)
  }
}
