import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowVersionsModule } from '../flow-versions/flow-versions.module'
import { FlowsController } from './flows.controller'
import { FlowHooks } from './flows.hooks'
import { FlowsService } from './flows.service'
import { FlowModelFactory } from './schemas/flow.schema'
import { TriggerHookssModule } from '../triggers/trigger-hooks/trigger-hooks.module'
import { RedisLockModule } from '../../../lib/redis-lock'

@Module({
  imports: [MongooseModule.forFeatureAsync([FlowModelFactory]), FlowVersionsModule, TriggerHookssModule, RedisLockModule],
  controllers: [FlowsController],
  providers: [FlowsService, FlowHooks],
	exports:[FlowsService]
})
export class FlowsModule {}
