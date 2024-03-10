import { WebhookResponse } from '@linkerry/connectors-framework'
import { ExecutionType, FlowRun, FlowStatus, FlowVersion, Id, RunEnvironment, assertNotNullOrUndefined, isNil } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FlowRunsService } from '../flows/flow-runs/flow-runs.service'
import { HookType } from '../flows/flow-runs/types'
import { FlowVersionDocument, FlowVersionModel } from '../flows/flow-versions/schemas/flow-version.schema'
import { TriggerEventsService } from '../flows/trigger-events/trigger-events.service'
import { TriggerHooks } from '../flows/triggers/trigger-hooks/trigger-hooks.service'
import { CallbackParams, HandshakeParams, SyncParams } from './types'
import { WebhookSimulationService } from './webhook-simulation/webhook-simulation.service'

@Injectable()
export class WebhooksService {
	private readonly logger = new Logger(WebhooksService.name)

	constructor(
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly triggerHooks: TriggerHooks,
		private readonly triggerEventsService: TriggerEventsService,
		private readonly flowRunsService: FlowRunsService,
		private readonly webhookSimulationService: WebhookSimulationService,
	) {
		//
	}

	_saveSampleDataForWebhookTesting(flowId: Id, projectId: Id, payload: unknown): void {
		this.triggerEventsService
			.saveEvent({
				flowId,
				payload,
				projectId,
			})
			.catch((e) => {
				this.logger.error(`#saveSampleDataForWebhookTesting triggerEventService.saveEvent`, e)
			})
	}

	async handshake({ flow, payload, simulate }: HandshakeParams): Promise<WebhookResponse | null> {
		this.logger.debug(`#handshake`, {
			flowId: flow._id,
		})

		const { projectId } = flow

		let flowVersion: FlowVersion | null
		if (simulate) {
			flowVersion = await this.flowVersionModel.findOne(
				{
					flowId: flow._id,
				},
				{},
				{
					sort: {
						createdAt: -1,
					},
				},
			)
		} else {
			flowVersion = await this.flowVersionModel.findOne({
				_id: flow.publishedVersionId,
			})
		}

		if (isNil(flowVersion)) {
			this.logger.error(`#handshake flowInstance not found`, { flowId: flow._id })
			return null
		}

		// const flowVersion = await flowVersionService.getOneOrThrow(flowVersionId)
		const response = await this.triggerHooks.tryHandshake({
			// TODO implement handling many triggers
			triggerName: flowVersion.triggers[0].name,
			projectId,
			flowVersion,
			payload,
		})
		if (response !== null) {
			this.logger.debug(`#handshake condition met, handshake executed, response`, {
				response,
			})
		}
		return response
	}

	async callback({ flow, payload, synchronousHandlerId }: SyncParams): Promise<FlowRun[]> {
		// logger.info(`[WebhookService#callback] flowId=${flow.id}`)
		this.logger.debug(`#callback`, {
			flowId: flow._id,
		})

		const { projectId } = flow

		if (isNil(flow.publishedVersionId)) {
			this.logger.debug(`#callback flowInstance not found`, {
				flowId: flow._id,
			})

			const flowVersion = await this.flowVersionModel.findOne({
					_id: flow.version._id,
					projectId,
			})

			if (isNil(flowVersion)) {
				this.logger.error(`#callback can not find flowVersion`)
				return []
			}

			const payloads: unknown[] = await this.triggerHooks.executeTrigger({
				projectId,
				flowVersion: flowVersion.toObject(),
				payload,
				simulate: false,
			})

			payloads.forEach((payload) => {
				this._saveSampleDataForWebhookTesting(flow._id, projectId, payload)
			})
			return []
		}

		if (flow.status !== FlowStatus.ENABLED) {
			this.logger.debug(`#callback flowInstance not found or not enabled ignoring the webhook`, {
				flowId: flow._id,
			})
			return []
		}

		const flowVersion = await this.flowVersionModel.findOne({
				_id: flow.publishedVersionId,
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const payloads: unknown[] = await this.triggerHooks.executeTrigger({
			projectId,
			flowVersion: flowVersion.toObject(),
			payload,
			simulate: false,
		})

		payloads.forEach((payload) => {
			this._saveSampleDataForWebhookTesting(flow._id, projectId, payload)
		})

		const createFlowRuns = payloads.map((payload) =>
			this.flowRunsService.start({
				environment: RunEnvironment.PRODUCTION,
				flowVersionId: flowVersion._id.toString(),
				payload,
				synchronousHandlerId,
				hookType: HookType.BEFORE_LOG,
				projectId,
				executionType: ExecutionType.BEGIN,
			}),
		)

		return Promise.all(createFlowRuns)
	}

	async simulationCallback({ flow, payload }: CallbackParams): Promise<void> {
		const { projectId } = flow

		const events = await this.triggerHooks.executeTrigger({
			projectId,
			flowVersion: flow.version,
			payload,
			simulate: true,
		})

		if (events.length === 0) {
			return
		}

		this.logger.debug(`#simulationCallback events`, {
			flowId: flow._id,
			events,
		})

		const eventSaveJobs = events.map((event) => this._saveSampleDataForWebhookTesting(flow._id, projectId, event))

		await Promise.all(eventSaveJobs)

		await this.webhookSimulationService.delete({ flowId: flow._id, projectId })
	}
}
