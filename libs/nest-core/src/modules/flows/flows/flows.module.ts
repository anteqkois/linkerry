import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowVersionsModule } from '../flow-versions'
import { TriggersModule } from '../triggers/triggers.module'
import { FlowsController } from './flows.controller'
import { FlowHooks } from './flows.hooks'
import { FlowsService } from './flows.service'
import { FlowModelFactory } from './schemas/flow.schema'

@Module({
  imports: [MongooseModule.forFeatureAsync([FlowModelFactory]), FlowVersionsModule, TriggersModule],
  controllers: [FlowsController],
  providers: [FlowsService, FlowHooks],
	exports:[FlowsService]
})
export class FlowsModule {}
