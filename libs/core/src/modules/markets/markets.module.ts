import { Module } from '@nestjs/common'
import { MarketsService } from './markets.service'
import { MarketsController } from './markets.controller'
import { marketModelFactory } from './schemas/exchange.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeatureAsync([marketModelFactory])],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
