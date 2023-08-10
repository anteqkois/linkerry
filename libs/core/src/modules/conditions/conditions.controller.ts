import { ConditionType, ICondition_CreateResponse, JwtUser } from '@market-connector/types'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { AlertGateway } from './alerts/alerts.gateway'
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/create-condition.dto'

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService, private readonly alertGateway: AlertGateway) {
    conditionsService.registerTypeGateway(ConditionType.Alert, alertGateway)
  }

  @Get()
  getCondition() {}

  @UseJwtGuard()
  @Post()
  createCondition(@ReqJwtUser() user: JwtUser, @Body() dto: CreateConditionDto): Promise<ICondition_CreateResponse> {
    return this.conditionsService.createCondition(dto, user.id)
  }
}
