import { Id, ProductConfig } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { TasksUsageService } from './tasks/tasks.service'

@Injectable()
export class UsageService {
	constructor(private readonly tasksUsageService: TasksUsageService) {}

	async currentPlanUsage(projectId: Id): Promise<Partial<ProductConfig>> {
		// TODO retrive app connections
		const tasks = await this.tasksUsageService.getCurrentPeriodUsage(projectId)

		return {
			tasks,
			connections: 0,
			projectMembers: 1,
			flows: 0,
			fileUploadsMB: 0,
			maximumActiveFlows: 0,
		}
	}
}
