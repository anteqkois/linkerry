import { Injectable } from '@nestjs/common'
import { ExchangeGateway } from './gateway'
import { ExchangeCode, IExchange } from '@market-connector/types'
import { Exchange } from './schemas/exchange.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class ExchangesService {
  private exchangeGateways: Record<string, ExchangeGateway> = {}

  registerTypeGateway(exchange: ExchangeCode, gateway: ExchangeGateway) {
    this.exchangeGateways[exchange] = gateway
  }

  constructor(@InjectModel(Exchange.name) private readonly exchangeModel: Model<Exchange>) {}

  async updateExchange(data: IExchange) {
    return this.exchangeModel.updateOne({ code: data.code }, data, { upsert: true })
  }
}
