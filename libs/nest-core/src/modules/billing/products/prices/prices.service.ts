import { Id, Price } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PriceDocument, PriceModel } from './price.schema'

@Injectable()
export class PricesService {
  constructor(@InjectModel(PriceModel.name) private readonly flowModel: Model<PriceDocument>) {}

  async create(input: Price) {
    const createdPrice = await this.flowModel.create(input)
    return createdPrice
    // const newPrice = await this.flowModel.findOne({
    // 	_id: createdPrice.
    // })
  }

  async findMany() {
    return this.flowModel.find()
  }

  async findOne(id: Id) {
    return this.flowModel.findOne({
      _id: id,
    })
  }
}
