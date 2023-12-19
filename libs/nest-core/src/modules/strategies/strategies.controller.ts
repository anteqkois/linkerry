import { IStrategy_CreateResponse, IStrategy_GetOneResponse} from '@market-connector/types'
import { Id, JwtUser} from '@market-connector/shared'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UsePaginatedResourceInterceptor } from '../../lib/utils'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { CreateStrategyDto, PatchStrategyStaticMarketDto } from './dto'
import { GetStrategiesQueryDto } from './dto/get-many.dto'
import { UpdateStrategyDto } from './dto/update.dto'
import { StrategiesService } from './strategies.service'
import { GetOneStrategyQueryDto } from './dto/get.dto'
import { PatchStrategyStrategyBuyDto } from './dto/strategies-buy/patch.dto'
import { CreateStrategyStrategyBuyDto } from './dto/strategies-buy/create.dto'

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

  @Post()
  create(@ReqJwtUser() user: JwtUser, @Body() dto: CreateStrategyDto): Promise<IStrategy_CreateResponse> {
    return this.strategiesService.create(dto, user.id)
  }

  @Patch('/:id')
  patch(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategyStaticMarketDto, @Param('id') id: Id) {
    return this.strategiesService.patch(dto, user.id, id)
  }

  @Put('/:id')
  update(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyDto, @Param('id') id: Id) {
    return this.strategiesService.update(dto, user.id, id)
  }

  @Post('/:id/strategies-buy')
  createStrategyBuy(@ReqJwtUser() user: JwtUser, @Body() dto: CreateStrategyStrategyBuyDto, @Param('id') id: Id) {
    return this.strategiesService.createStrategyBuy(dto, user.id, id)
  }

  @Patch('/:id/strategies-buy/:sId')
  updateStrategyBuy(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategyStrategyBuyDto, @Param('id') id: Id, @Param('sId') sId: Id) {
    return this.strategiesService.patchStrategyBuy(dto, user.id, id, sId)
  }

  @Delete('/:id/strategies-buy/:sId')
  removeStrategyBuy(@ReqJwtUser() user: JwtUser, @Param('id') id: Id, @Param('sId') sId: Id) {
    return this.strategiesService.removeStrategyBuy(user.id, id, sId)
  }
}
