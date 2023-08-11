import {
  IStrategy_CreateResponse,
  IStrategy_GetOneResponse,
  IStrategy_GetResponse,
  Id,
  JwtUser,
} from '@market-connector/types'
import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { StrategiesService } from './strategies.service'
import { CreateStrategyStaticMarketDto, PatchStrategyStaticMarketDto, UpdateStrategyStaticMarketDto } from './dto'
import { GetManyStrategiesQueryDto } from './dto/get-many.dto'
import { UsePaginatedResourceInterceptor } from '../../lib/utils'

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @UseJwtGuard()
  @Get('/:id')
  findOne(@ReqJwtUser() user: JwtUser, @Param('id') id: string): Promise<IStrategy_GetOneResponse> {
    return this.strategiesService.findOne(id, user.id)
  }

  @UseJwtGuard()
  @UsePaginatedResourceInterceptor()
  @Get('')
  find(@ReqJwtUser() user: JwtUser, @Query() query: GetManyStrategiesQueryDto) {
    return this.strategiesService.findMany(user.id, query)
  }

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
