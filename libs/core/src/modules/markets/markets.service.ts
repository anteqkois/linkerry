import { Model, MongooseBulkWriteOptions } from 'mongoose'
import { IMarket } from '@market-connector/types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Market } from './schemas/exchange.schema'

@Injectable()
export class MarketsService {
  constructor(@InjectModel(Market.name) private readonly marketModel: Model<Market>) {}

  async insertMany(data: IMarket[]) {
    return await this.marketModel.insertMany(data)
  }

  // async upsertMany(data: IMarket[] | Array<{ updateOne: Parameters<Model<Market>['updateOne']> }>) {
  async upsertMany(data: IMarket[]) {
    const insertData = []

    for (let i in data) {
      console.log(data[i])
      insertData.push({
        updateOne: {
          filter: { code: data[i].code, exchangeCode: data[i].exchangeCode },
          update: data[i],
          upsert: true,
        },
      })
      // TODO improve performance
      // data[i] = {
      //   updateOne: {
      //     filter: { code: data[i].code, exchangeCode: data[i].exchangeCode },
      //     update: data[i],
      //     upsert: true,
      //   },
      // }
    }

    this.marketModel.bulkWrite(insertData)
  }
}
