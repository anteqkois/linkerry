import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ExchangesService } from './exchanges.service'
import { JwtAuthGuard } from '../../lib/auth'

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getExchanges() {
    return this.exchangesService.findMany
  }

  @UseGuards(JwtAuthGuard)
  @Get(':code')
  getExchange(@Param('code') code: string) {
    return this.exchangesService.findOne({ code })
  }
}
