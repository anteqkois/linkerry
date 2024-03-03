import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowsService } from '../flows/flows.service'
import { FlowRunModel } from './schemas/flow-runs.schema'

@Injectable()
export class FlowRunsHooks {
	private readonly logger = new Logger(FlowRunsHooks.name)

	constructor(
		@InjectModel(FlowRunModel.name) private readonly flowRunModel: Model<FlowRunModel>,
		private readonly flowVersionsService: FlowVersionsService,
		private readonly flowsService: FlowsService,
	) {}

	async onPreStart({ projectId }: { projectId: string }): Promise<void> {
		// TODO implement quota computing
		// /Users/anteqkois/Code/Projects/me/activepieces/packages/backend/src/app/ee/flow-run/cloud-flow-run-hooks.ts
		// await tasksLimit.limit({
		// 	projectId,
		// })
	}

	async onFinish({ projectId, tasks }: { projectId: string; tasks: number }): Promise<void> {
		// TODO implement quota computing
		// /Users/anteqkois/Code/Projects/me/activepieces/packages/backend/src/app/ee/flow-run/cloud-flow-run-hooks.ts
		// await projectUsageService.addTasksConsumed({
		//     projectId,
		//     tasks,
		// })
	}
}
