import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PriceModelFactory } from './price.schema'
import { PricesAdminController } from './prices-admin.controller'
import { PricesController } from './prices.controller'
import { PricesService } from './prices.service'

@Module({
  imports: [MongooseModule.forFeatureAsync([PriceModelFactory])],
  controllers: [PricesController, PricesAdminController],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}
