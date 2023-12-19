import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MarketsController } from './markets.controller'
import { MarketsService } from './markets.service'
import { marketModelFactory } from './schemas/market.schema'

@Module({
  imports: [MongooseModule.forFeatureAsync([marketModelFactory])],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
