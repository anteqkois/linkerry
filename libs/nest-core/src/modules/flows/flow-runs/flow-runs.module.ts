import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QueuesModule } from '../../workers/flow-worker/queues/queues.module'
import { flowVersionModelFactory } from '../flow-versions/schemas/flow-version.schema'
import { FlowModelFactory } from '../flows/schemas/flow.schema'
import { FlowResponseService } from './flow-response.service'
import { FlowRunsController } from './flow-runs.controller'
import { FlowRunsHooks } from './flow-runs.hooks'
import { FlowRunsService } from './flow-runs.service'
import { FlowRunModelFactory } from './schemas/flow-runs.schema'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([FlowRunModelFactory, FlowModelFactory, flowVersionModelFactory]),
		QueuesModule
	],
	controllers: [FlowRunsController],
	providers: [FlowRunsService, FlowResponseService, FlowRunsHooks],
	exports: [FlowRunsService],
})
export class FlowRunsModule {}
