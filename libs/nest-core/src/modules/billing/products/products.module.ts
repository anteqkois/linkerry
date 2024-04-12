import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductModelFactory } from './product.schema'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([ProductModelFactory])],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService],
})
export class ProductsModule {}