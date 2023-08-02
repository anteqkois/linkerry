import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ExchangesService } from './exchanges.service'
import { JwtAuthGuard } from '../../lib/auth'
import { PaginateResourceInterceptor } from '../../lib/utils'
import { GetManyExchangesQueryDto } from './dto/get-many-exchanges.dto'

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @UseGuards(JwtAuthGuard)
  @PaginateResourceInterceptor()
  @Get()
  async getExchanges(@Query() query: GetManyExchangesQueryDto) {
    const exchanges = await this.exchangesService.findMany(query)
    return { exchanges }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':code')
  getExchange(@Param('code') code: string) {
    return this.exchangesService.findOne({ code })
  }
}
