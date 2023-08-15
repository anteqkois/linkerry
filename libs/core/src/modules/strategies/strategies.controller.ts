import { IStrategy_CreateResponse, IStrategy_GetOneResponse, Id, JwtUser } from '@market-connector/types'
import { Body, Controller, Get, Param, ParseArrayPipe, Patch, Post, Put, Query } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UsePaginatedResourceInterceptor } from '../../lib/utils'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { CreateStrategyDto, PatchStrategyStaticMarketDto } from './dto'
import { GetStrategiesQueryDto } from './dto/get-many.dto'
import { UpdateStrategyDto } from './dto/update.dto'
import { StrategiesService } from './strategies.service'
import { GetOneStrategyQueryDto } from './dto/get.dto'

@Controller('strategies')
@UseJwtGuard()
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Get('/:id')
  findOne(
    @ReqJwtUser() user: JwtUser,
    @Query() query: GetOneStrategyQueryDto,
    @Param('id') id: string,
  ): Promise<IStrategy_GetOneResponse<any>> {
    return this.strategiesService.findOne(id, user.id, query)
  }

  @Get()
  @UsePaginatedResourceInterceptor()
  find(@ReqJwtUser() user: JwtUser, @Query() query: GetStrategiesQueryDto) {
    return this.strategiesService.findMany(user.id, query)
  }

  @Patch('/:id')
  patch(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategyStaticMarketDto, @Param('id') id: Id) {
    return this.strategiesService.patch(dto, user.id, id)
  }

  @Post()
  create(@ReqJwtUser() user: JwtUser, @Body() dto: CreateStrategyDto): Promise<IStrategy_CreateResponse> {
    return this.strategiesService.create(dto, user.id)
  }

  @Put('/:id')
  update(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyDto, @Param('id') id: Id) {
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
