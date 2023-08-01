import { FilterQuery, Model, MongooseBulkWriteOptions } from 'mongoose'
import { IMarket } from '@market-connector/types'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Market } from './schemas/exchange.schema'

@Injectable()
export class MarketsService {
  private logger = new Logger(MarketsService.name)
  constructor(@InjectModel(Market.name) private readonly marketModel: Model<Market>) {}

  async insertMany(data: IMarket[]) {
    return await this.marketModel.insertMany(data)
  }

  // async upsertMany(data: IMarket[] | Array<{ updateOne: Parameters<Model<Market>['updateOne']> }>) {
  async upsertMany(data: IMarket[]) {
    this.marketModel
      .bulkWrite(
        data.map((market) => ({
          updateOne: {
            filter: { code: market.code, exchangeCode: market.exchangeCode, type: market.type },
            update: market,
            upsert: true,
          },
        })),
      )
      .then((result) => {
        this.logger.log(`Upsert ${result.modifiedCount} markets`)
      })
  }

  async findOne(filter: FilterQuery<Market>): Promise<IMarket | null> {
    return this.marketModel.findOne(filter)
  }

  async findMany(filter: FilterQuery<Market>): Promise<IMarket[] | null> {
    return this.marketModel.find(filter)
  }
}
