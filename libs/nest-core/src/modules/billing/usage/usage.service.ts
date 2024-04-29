import { FlowStatus, Id, UsageResponse } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AppConnectionsModel } from '../../app-connections/schemas/connections.schema'
import { FlowModel } from '../../flows/flows/schemas/flow.schema'
import { TasksUsageService } from './tasks/tasks.service'

@Injectable()
export class UsageService {
	constructor(
		@InjectModel(AppConnectionsModel.name) private readonly appConnectionsModel: Model<AppConnectionsModel>,
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>,
		private readonly tasksUsageService: TasksUsageService,
	) {}

	async currentPlanUsage(projectId: Id): Promise<UsageResponse> {
		// TODO retrive app connections
		const tasks = await this.tasksUsageService.getCurrentPeriodUsage(projectId)
		const tasksPastSevenDays = await this.tasksUsageService.getPastSevenDaysUsage(projectId)
		const projectAppConnections = await this.appConnectionsModel.countDocuments({
			projectId,
		})
		const projectFlows = await this.flowModel.countDocuments({
			projectId,
			deleted: false,
		})
		const projectRunningFlows = await this.flowModel.countDocuments({
			projectId,
			status: FlowStatus.ENABLED,
			deleted: false,
		})

		return {
			tasks,
			tasksPastSevenDays,
			connections: projectAppConnections,
			projectMembers: 1,
			flows: projectFlows,
			fileUploadsMB: 0,
			maximumActiveFlows: projectRunningFlows,
		}
	}
}
