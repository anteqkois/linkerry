import { CustomError, ErrorCode, Id, QuotaError, SubscriptionStatus, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import mongoose, { Model } from 'mongoose'
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
		if (currentUsage >= planProduct.config.tasks) throw new QuotaError('tasks')
	}

	async getCurrentPeriodUsage(projectId: Id) {
		const monthStart = dayjs().set('date', 1).startOf('day')

		const usageTasks = (await this.tasksUsageModel.aggregate([
			{
				$match: {
					projectId: new mongoose.Types.ObjectId(projectId),
					createdAt: {
						$gte: monthStart.toDate(),
					},
				},
			},
			{
				$group: {
					_id: null,
					tasks: { $sum: '$tasks' },
				},
			},
		])) as [{ _id: null; tasks: number }] | []

		return usageTasks[0]?.tasks ?? 0
	}

	async getPastSevenDaysUsage(projectId: Id) {
		const monthStart = dayjs().subtract(7, 'days').startOf('day')

		const sevenDaysUsage = await this.tasksUsageModel.find(
			{
				projectId: new mongoose.Types.ObjectId(projectId),
				createdAt: {
					$gte: monthStart.toDate(),
				},
			},
			{},
			{
				sort: {
					createdAt: -1,
				},
			},
		)

		return sevenDaysUsage
	}

	async increaseTasks({ projectId, tasks }: { projectId: Id; tasks: number }) {
		return this.tasksUsageModel.findOneAndUpdate(
			{
				projectId,
			},
			{
				$inc: { tasks: tasks },
			},
			{
				new: true,
				upsert: true,
			},
		)
	}
}
