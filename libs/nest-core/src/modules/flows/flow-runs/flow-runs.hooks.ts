import { Injectable, Logger } from '@nestjs/common';
import { TasksUsageService } from '../../billing/usage/tasks/tasks.service';

@Injectable()
export class FlowRunsHooks {
	private readonly logger = new Logger(FlowRunsHooks.name)

	constructor(private readonly tasksUsageService: TasksUsageService) {}

	async onPreStart({ projectId }: { projectId: string }): Promise<void> {
		await this.tasksUsageService.checkTaskLimitAndThrow(projectId)
	}

	async onFinish({ projectId, tasks }: { projectId: string; tasks: number }): Promise<void> {
		await this.tasksUsageService.increaseTasks({projectId, tasks})
	}
}
