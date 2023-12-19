import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { UsePaginatedResourceInterceptor } from '../../lib/utils'
import { GetManyExchangesQueryDto } from './dto/get-many-exchanges.dto'
import { ExchangesService } from './exchanges.service'

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @UseGuards(JwtAuthGuard)
  @UsePaginatedResourceInterceptor()
  @Get()
  async getExchanges(@Query() query: GetManyExchangesQueryDto) {
    return this.exchangesService.findMany(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':code')
  getExchange(@Param('code') code: string) {
    return this.exchangesService.findOne({ code })
  }
}
