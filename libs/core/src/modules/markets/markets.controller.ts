import { IMarketResponse } from '@market-connector/types'
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { GetManyMarketsQueryDto } from './dto/get-many-markets.dto'
import { MarketsService } from './markets.service'

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMarkets(@Query() query: GetManyMarketsQueryDto): Promise<IMarketResponse> {
    const markets = await this.marketsService.findMany(query)
    
    return {
      count: markets.length,
      data: {
        markets,
      },
      hasNext: markets.length === query.limit,
      offset: query.offset,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMarket(@Param('id') id: string) {
    return this.marketsService.findOne({ _id: id })
  }
}
