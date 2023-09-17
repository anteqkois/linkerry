import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowVersionsModule } from '../flow-versions'
import { FlowsController } from './flows.controller'
import { FlowsService } from './flows.service'
import { FlowModelFactory } from './schemas/flow.schema'

@Module({
  imports: [MongooseModule.forFeatureAsync([FlowModelFactory]), FlowVersionsModule],
  controllers: [FlowsController],
  providers: [FlowsService],
})
export class FlowsModule {}
