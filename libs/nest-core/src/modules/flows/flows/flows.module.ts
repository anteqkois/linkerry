import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RedisLockModule } from '../../../lib/redis-lock'
import { SubscriptionsModule } from '../../billing/subscriptions/subscriptions.module'
import { FlowVersionsModule } from '../flow-versions/flow-versions.module'
import { TriggerHooksModule } from '../triggers/trigger-hooks/trigger-hooks.module'
import { FlowsController } from './flows.controller'
import { FlowHooks } from './flows.hooks'
import { FlowsService } from './flows.service'
import { FlowModelFactory } from './schemas/flow.schema'

@Module({
	imports: [MongooseModule.forFeatureAsync([FlowModelFactory]), FlowVersionsModule, TriggerHooksModule, RedisLockModule, SubscriptionsModule],
	controllers: [FlowsController],
	providers: [FlowsService, FlowHooks],
	exports: [FlowsService],
})
export class FlowsModule {}
