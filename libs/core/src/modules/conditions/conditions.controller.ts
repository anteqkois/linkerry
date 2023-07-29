import { ConditionTypeType, JWTUser } from '@market-connector/types'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { ReqJWTUser } from '../../lib/auth/decorators/req-user.decorator'
import { AlertGateway } from './alerts/alerts.gateway'
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/create-condition.dto'

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService, private readonly alertGateway: AlertGateway) {
    conditionsService.registerTypeGateway(ConditionTypeType.ALERT, alertGateway)
  }

  @Get()
  getCondition() {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createCondition(@ReqJWTUser() user: JWTUser, @Body() dto: CreateConditionDto) {
    return this.conditionsService.createCondition(dto, user.id)
  }
}
