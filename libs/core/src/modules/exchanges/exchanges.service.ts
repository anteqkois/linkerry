import { Injectable } from '@nestjs/common'
import { ExchangeGateway } from './gateway'
import { ExchangeCode } from '@market-connector/types'

@Injectable()
export class ExchangesService {
  private exchangeGateways: Record<string, ExchangeGateway> = {}

  public registerTypeGateway(exchange: ExchangeCode, gateway: ExchangeGateway) {
    this.exchangeGateways[exchange] = gateway
  }
}
