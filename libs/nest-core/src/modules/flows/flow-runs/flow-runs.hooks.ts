import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FlowRunsHooks {
	private readonly logger = new Logger(FlowRunsHooks.name)

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
