import { IStrategy_CreateResponse, Id, JwtUser } from '@market-connector/types'
import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { StrategiesService } from './strategies.service'
import { CreateStrategyStaticMarketDto, PatchStrategyStaticMarketDto, UpdateStrategyStaticMarketDto } from './dto'

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

  @UseJwtGuard()
  @Patch('/static-market/:id')
  patchStaticMarket(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategyStaticMarketDto, @Param('id') id: Id) {
    return this.strategiesService.patchStaticMarket(dto, user.id, id)
  }
}
