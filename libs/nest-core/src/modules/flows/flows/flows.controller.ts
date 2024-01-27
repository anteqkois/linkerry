import { Id, RequestUser } from '@linkerry/shared'
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../../lib/auth/decorators/req-user.decorator'
import { FlowsService } from './flows.service'

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: Id) {
    return this.flowsService.findOne(id, user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delteFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: Id) {
    return this.flowsService.deleteOne(id, user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createEmptyFlow(@ReqJwtUser() user: RequestUser) {
    return this.flowsService.createEmpty(user.id)
  }
}
