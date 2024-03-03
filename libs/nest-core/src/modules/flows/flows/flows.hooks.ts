import { Flow, FlowScheduleOptions, FlowStatus, FlowVersion, ScheduleOptions, ScheduleType, assertNotNullOrUndefined, isNil } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { TriggerHooks } from '../triggers/trigger-hooks/trigger-hooks.service'

type PreUpdateParams = {
	flowToUpdate: Flow
}

type PreUpdateStatusParams = PreUpdateParams & {
	newStatus: FlowStatus
}

type PreUpdatePublishedVersionIdParams = PreUpdateParams & {
	flowVersionToPublish: FlowVersion
}

type PreUpdateReturn = {
	scheduleOptions: FlowScheduleOptions | null
}

type PreDeleteParams = {
	flowToDelete: Flow
}

@Injectable()
export class FlowHooks {
	constructor(
		private readonly flowVersionService: FlowVersionsService,
		private readonly triggerHooks: TriggerHooks,
	) {}

	async preUpdateStatus({ flowToUpdate, newStatus }: PreUpdateStatusParams): Promise<PreUpdateReturn> {
		assertNotNullOrUndefined(flowToUpdate.publishedVersionId, 'publishedVersionId')

		const publishedFlowVersion = await this.flowVersionService.findOne({
			filter: {
				flowId: flowToUpdate._id,
				versionId: flowToUpdate.publishedVersionId,
			},
		})
		assertNotNullOrUndefined(publishedFlowVersion, 'publishedFlowVersion')

		let scheduleOptions: ScheduleOptions | undefined

		switch (newStatus) {
			case FlowStatus.ENABLED: {
				const response = await this.triggerHooks.enable({
					flowVersion: publishedFlowVersion,
					projectId: flowToUpdate.projectId,
					simulate: false,
				})
				scheduleOptions = response?.result.scheduleOptions
				break
			}
			case FlowStatus.DISABLED: {
				await this.triggerHooks.disable({
					flowVersion: publishedFlowVersion,
					projectId: flowToUpdate.projectId,
					simulate: false,
				})
				break
			}
		}

		if (isNil(scheduleOptions)) {
			return {
				scheduleOptions: null,
			}
		}

		return {
			scheduleOptions: {
				...scheduleOptions,
				type: ScheduleType.CRON_EXPRESSION,
			},
		}
	}

	async preUpdatePublishedVersionId({ flowToUpdate, flowVersionToPublish }: PreUpdatePublishedVersionIdParams): Promise<PreUpdateReturn> {
		if (flowToUpdate.status === FlowStatus.ENABLED && flowToUpdate.publishedVersionId) {
			const flowVersion = await this.flowVersionService.findOne({
				filter: {
					_id: flowToUpdate.publishedVersionId,
				},
			})
			assertNotNullOrUndefined(flowVersion, 'flowVersion')

			await this.triggerHooks.disable({
				flowVersion,
				projectId: flowToUpdate.projectId,
				simulate: false,
			})
		}

		const enableResult = await this.triggerHooks.enable({
			flowVersion: flowVersionToPublish,
			projectId: flowToUpdate.projectId,
			simulate: false,
		})

		const scheduleOptions = enableResult?.result.scheduleOptions

		if (isNil(scheduleOptions)) {
			return {
				scheduleOptions: null,
			}
		}

		return {
			scheduleOptions: {
				...scheduleOptions,
				type: ScheduleType.CRON_EXPRESSION,
			},
		}
	}

	async preDelete({ flowToDelete }: PreDeleteParams): Promise<void> {
		if (flowToDelete.status === FlowStatus.DISABLED || isNil(flowToDelete.publishedVersionId)) return

		const publishedFlowVersion = await this.flowVersionService.findOne({
			filter: {
				flowId: flowToDelete._id,
				versionId: flowToDelete.publishedVersionId,
			},
		})

		assertNotNullOrUndefined(publishedFlowVersion, 'publishedFlowVersion')

		await this.triggerHooks.disable({
			flowVersion: publishedFlowVersion,
			projectId: flowToDelete.projectId,
			simulate: false,
		})
	}
}
