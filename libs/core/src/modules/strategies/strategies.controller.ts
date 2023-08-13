import {
  IStrategy_CreateResponse,
  IStrategy_GetOneResponse,
  Id,
  JwtUser
} from '@market-connector/types'
import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UsePaginatedResourceInterceptor } from '../../lib/utils'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { CreateStrategyDto, PatchStrategyStaticMarketDto, UpdateStrategyStaticMarketDto } from './dto'
import { GetManyStrategiesQueryDto } from './dto/get-many.dto'
import { StrategiesService } from './strategies.service'
import { UpdateStrategyDto } from './dto/update.dto'

@Controller('strategies')
@UseJwtGuard()
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Get('/:id')
  findOne(@ReqJwtUser() user: JwtUser, @Param('id') id: string): Promise<IStrategy_GetOneResponse> {
    return this.strategiesService.findOne(id, user.id)
  }

  @Get('')
  @UsePaginatedResourceInterceptor()
  find(@ReqJwtUser() user: JwtUser, @Query() query: GetManyStrategiesQueryDto) {
    return this.strategiesService.findMany(user.id, query)
  }

  @Patch('/:id')
  patch(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategyStaticMarketDto, @Param('id') id: Id) {
    return this.strategiesService.patch(dto, user.id, id)
  }

  @Post('/')
  createStaticMarket(
    @ReqJwtUser() user: JwtUser,
    @Body() dto: CreateStrategyDto,
  ): Promise<IStrategy_CreateResponse> {
    return this.strategiesService.create(dto, user.id)
  }

  @Put('/:id')
  updateStaticMarket(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyDto, @Param('id') id: Id) {
    return this.strategiesService.update(dto, user.id, id)
  }

  // @Post('/static-market')
  // createStaticMarket(
  //   @ReqJwtUser() user: JwtUser,
  //   @Body() dto: CreateStrategyStaticMarketDto,
  // ): Promise<IStrategy_CreateResponse> {
  //   return this.strategiesService.create(dto, user.id)
  // }

  // @Put('/static-market/:id')
  // updateStaticMarket(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyStaticMarketDto, @Param('id') id: Id) {
  //   return this.strategiesService.updateStaticMarket(dto, user.id, id)
  // }

  // @Patch('/static-market/:id')
  // patchStaticMarket(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategyStaticMarketDto, @Param('id') id: Id) {
  //   return this.strategiesService.patchStaticMarket(dto, user.id, id)
  // }
}
