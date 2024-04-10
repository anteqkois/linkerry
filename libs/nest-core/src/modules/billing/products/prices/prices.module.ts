import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PriceModelFactory } from './price.schema'
import { PricesController } from './prices.controller'
import { PricesService } from './prices.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([PriceModelFactory])],
	controllers: [PricesController],
	providers: [PricesService],
	exports: [PricesService],
})
export class PricesModule {}
