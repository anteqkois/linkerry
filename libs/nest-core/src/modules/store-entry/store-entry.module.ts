import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StoreEntryModelFactory } from './schemas/store-entry.schema'
import { StoreEntryController } from './store-entry.controller'
import { StoreEntryService } from './store-entry.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([StoreEntryModelFactory])],
	controllers: [StoreEntryController],
	providers: [StoreEntryService],
})
export class StoreEntryModule {}
