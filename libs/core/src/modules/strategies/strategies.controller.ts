import { IStrategy_CreateResponse, Id, JwtUser } from '@market-connector/types'
import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { CreateStrategyStaticMarketDto } from './dto/create-strategy-static-market.dto'
import { StrategiesService } from './strategies.service'
import { UpdateStrategyStaticMarketDto } from './dto/update-strategy-static-market.dto'

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @UseJwtGuard()
  @Post('/static-market')
  createStaticMarket(
    @ReqJwtUser() user: JwtUser,
    @Body() dto: CreateStrategyStaticMarketDto,
  ): Promise<IStrategy_CreateResponse> {
    return this.strategiesService.createStaticMarket(dto, user.id)
  }

  @UseJwtGuard()
  @Put('/static-market/:id')
  updateStaticMarket(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyStaticMarketDto, @Param('id') id: Id) {
    return this.strategiesService.updateStaticMarket(dto, user.id, id)
  }
}
