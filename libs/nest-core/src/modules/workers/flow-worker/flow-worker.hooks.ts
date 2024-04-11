import { Id } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { TasksUsageService } from '../../billing/usage/tasks/tasks.service'

@Injectable()
export class FlowWorkerHooks {
	private readonly logger = new Logger(FlowWorkerHooks.name)

	constructor(private readonly tasksUsageService: TasksUsageService) {}

	async preExecute({ projectId }: PreExecuteParams) {
		await this.tasksUsageService.checkTaskLimitAndThrow(projectId)
	}
}

export interface PreExecuteParams {
	projectId: Id
	runId: Id
}
