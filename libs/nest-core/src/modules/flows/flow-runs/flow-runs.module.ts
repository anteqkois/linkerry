import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowWorkerModule } from '../../workers/flow-worker'
import { QueuesModule } from '../../workers/flow-worker/queues'
import { FlowVersionsModule } from '../flow-versions'
import { FlowsModule } from '../flows'
import { FlowResponseService } from './flow-response.service'
import { FlowRunsController } from './flow-runs.controller'
import { FlowRunsHooks } from './flow-runs.hooks'
import { FlowRunsService } from './flow-runs.service'
import { FlowRunModelFactory } from './schemas/flow-runs.schema'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([FlowRunModelFactory]),
		FlowVersionsModule,
		forwardRef(() => FlowsModule),
		forwardRef(() => FlowWorkerModule),
		QueuesModule
	],
	controllers: [FlowRunsController],
	providers: [FlowRunsService, FlowResponseService, FlowRunsHooks],
	exports: [FlowRunsService],
})
export class FlowRunsModule {}
