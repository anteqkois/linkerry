import { Module } from '@nestjs/common'
import { FlowVersionsModule } from '../flow-versions'
import { FlowResponseService } from './flow-response.service'
import { FlowRunsController } from './flow-runs.controller'
import { FlowRunsHooks } from './flow-runs.hooks'
import { FlowRunsService } from './flow-runs.service'

@Module({
	imports: [FlowVersionsModule],
	controllers: [FlowRunsController],
	providers: [FlowRunsService, FlowResponseService, FlowRunsHooks],
})
export class FlowRunsModule {}
