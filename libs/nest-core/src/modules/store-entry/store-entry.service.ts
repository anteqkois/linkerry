import { Id } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StoreEntryModel } from './schemas/store-entry.schema'

@Injectable()
export class StoreEntryService {
  constructor(@InjectModel(StoreEntryModel.name) private readonly storeEntryModel: Model<StoreEntryModel>) {}

  async findOne(projectId: Id, key: string) {
    return this.storeEntryModel.findOne({
      projectId,
      key,
    })
  }

  async upsert(projectId: Id, key: string, value: unknown) {
    return this.storeEntryModel.findOneAndUpdate(
      {
        projectId,
        key,
      },
      {
        projectId,
        key,
        value,
      },
      {
        upsert: true,
        new: true,
      },
    )
  }

  async deleteOne(projectId: Id, key: string) {
    return this.storeEntryModel.deleteOne({
      projectId,
      key,
    })
  }
}
