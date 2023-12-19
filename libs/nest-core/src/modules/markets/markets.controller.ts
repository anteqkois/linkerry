import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { UsePaginatedResourceInterceptor } from '../../lib/utils'
import { GetManyMarketsQueryDto } from './dto/get-many-markets.dto'
import { MarketsService } from './markets.service'

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @UseGuards(JwtAuthGuard)
  @UsePaginatedResourceInterceptor()
  @Get()
  async getMarkets(@Query() query: GetManyMarketsQueryDto) {
    return this.marketsService.findMany(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMarket(@Param('id') id: string) {
    return this.marketsService.findOne({ _id: id })
  }
}
