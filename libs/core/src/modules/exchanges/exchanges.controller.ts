import { Controller } from '@nestjs/common'
import { ExchangesService } from './exchanges.service'
import { ExchangeCode } from '@market-connector/types'
import { BinanceGateway } from './gateways/binance.gateway'

@Controller('exchanges')
export class ExchangesController {
  // constructor(private readonly exchangesService: ExchangesService, private readonly binanceGateway: BinanceGateway) {
  //   exchangesService.registerTypeGateway(ExchangeCode.binance, binanceGateway)
  // }
}
