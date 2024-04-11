import { CustomError, ErrorCode, Id, SubscriptionStatus, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SubscriptionsService } from '../../subscriptions/subscriptions.service'
import { TasksUsageDocument, TasksUsageModel } from './tasks.schema'

@Injectable()
export class TasksUsageService {
	constructor(
		@InjectModel(TasksUsageModel.name) private readonly tasksUsageModel: Model<TasksUsageDocument>,
		private readonly subscriptionsService: SubscriptionsService,
	) {}

	async checkTaskLimitAndThrow(projectId: Id) {
		const projectSubscriptions = await this.subscriptionsService.findMany({
			projectId,
		})
		const activeSubscriptions = projectSubscriptions.filter((subscription) => subscription.status === SubscriptionStatus.ACTIVE)
		assertNotNullOrUndefined(activeSubscriptions, 'activeSubscriptions')
		if (activeSubscriptions.length > 1) throw new CustomError(`More than one active subscriptions for project ${projectId}`, ErrorCode.INVALID_TYPE)

		const planProduct = activeSubscriptions[0].products[0]
		const currentUsage = await this.getCurrentPeriodUsage(projectId)
		if (currentUsage >= planProduct.config.tasks)
			throw new CustomError(`Exceeded tasks limit for current plan`, ErrorCode.QUOTA_EXCEEDED, {
				currentUsage,
			})
	}

	async getCurrentPeriodUsage(projectId: Id) {
		// TODO
		return 0
	}

	async increaseTasks({ projectId, tasks }: { projectId: Id; tasks: number }) {
		await this.tasksUsageModel.findOneAndUpdate(
			{
				projectId,
			},
			{
				tasks: {
					$inc: tasks,
				},
			},
			{
				new: true,
				upsert: true,
			},
		)
	}
}
