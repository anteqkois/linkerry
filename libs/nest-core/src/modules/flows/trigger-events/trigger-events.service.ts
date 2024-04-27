import {
	CustomError,
	DeleteTriggerEventsInput,
	ErrorCode,
	FlowOperationType,
	FlowPopulated,
	GetTriggerEventsQuery,
	Id,
	Trigger,
	TriggerHookType,
	TriggerPoolTestBody,
	TriggerType,
	WatchTriggerEventsWSInput,
	WatchTriggerEventsWSResponse,
	assertNotNullOrUndefined,
	flowHelper,
} from '@linkerry/shared'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
// import { StepFilesService } from '../step-files/step-files.service'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import mongoose, { Model } from 'mongoose'
import { RedisLockService } from '../../../lib/redis-lock'
import { WebhookSimulationService } from '../../webhooks/webhook-simulation/webhook-simulation.service'
import { WebhookUrlsService } from '../../webhooks/webhook-urls/webhook-urls.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowVersionDocument, FlowVersionModel } from '../flow-versions/schemas/flow-version.schema'
import { FlowDocument, FlowModel } from '../flows/schemas/flow.schema'
import { StepFilesService } from '../step-files/step-files.service'
import { TriggerEventModel } from './schemas/trigger-events.schema'
import { InsertNewTrigerEventEvent, SaveTriggerEventInput } from './types'

// const listeners = new Map<string, (data: WatchTriggerEventsWSResponse) => void>()
const listeners = new Map<string, { resolve: (data: WatchTriggerEventsWSResponse) => Promise<void>; cancel: () => Promise<void> }>()
const triggerEventsWatchers = new Map<string, ReturnType<Model<FlowDocument>['collection']['watch']>>()

@Injectable()
export class TriggerEventsService {
	private readonly logger = new Logger(TriggerEventsService.name)
	private readonly WEBHOOK_TIMEOUT_MS

	constructor(
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowDocument>,
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		@InjectModel(TriggerEventModel.name) private readonly triggerEventsModel: Model<TriggerEventModel>,
		private readonly stepFilesService: StepFilesService,
		private readonly flowVersionsService: FlowVersionsService,
		private readonly engineService: EngineService,
		private readonly webhookUrlsService: WebhookUrlsService,
		private readonly webhookSimulationService: WebhookSimulationService,
		private readonly redisLockService: RedisLockService,
		private readonly configService: ConfigService,
	) {
		this.WEBHOOK_TIMEOUT_MS = (+configService.get('WEBHOOK_TIMEOUT_SECONDS') ?? 30) * 1000
		// this.WEBHOOK_TIMEOUT_MS = (+configService.get('WEBHOOK_TIMEOUT_SECONDS') ?? 5) * 1000
	}

	private async _deleteOldFilesForTestData({ projectId, flowId, stepName }: { projectId: string; flowId: string; stepName: string }): Promise<void> {
		await this.stepFilesService.deleteAll({
			projectId,
			flowId,
			stepName,
		})
	}

	async deleteAllRelatedToTrigger({ flowId, trigger }: { flowId: Id; trigger: Trigger }) {
		const sourceName = this._getSourceName(trigger)
		return this.triggerEventsModel.deleteMany({
			flowId,
			sourceName,
		})
	}

	async saveEvent(data: SaveTriggerEventInput) {
		if (!data.sourceName) {
			const flowVersion = await this.flowVersionModel.findOne({
				flow: data.flowId,
				projectId: data.projectId,
			})

			assertNotNullOrUndefined(flowVersion, 'flowVersion')

			// TODO handle many triggers
			data.sourceName = this._getSourceName(flowVersion.triggers[0])
		}

		return this.triggerEventsModel.create(data)
	}

	async findMany({ flowLike, triggerName }: { flowLike: Id | FlowPopulated; triggerName: string }) {
		const flow =
			typeof flowLike === 'string'
				? await this.flowModel
						.findOne<FlowPopulated>({
							_id: flowLike,
						})
						.populate('version')
				: flowLike
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const trigger = flowHelper.getTrigger(flow.version, triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger by name`)

		const sourceName = this._getSourceName(trigger)
		return this.triggerEventsModel.find({
			flowId: flow._id,
			sourceName,
		})
	}

	async deleteMany({ flowId, triggerName }: DeleteTriggerEventsInput, projectId: Id) {
		const flow = await this.flowModel
			.findOne<FlowPopulated>({
				_id: flowId,
				projectId,
			})
			.populate('version')

		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const trigger = flowHelper.getTrigger(flow.version, triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger by name`)

		return this.deleteAllRelatedToTrigger({
			flowId,
			trigger,
		})
	}

	async test(input: TriggerPoolTestBody, projectId: Id, userId: Id) {
		const flow = await this.flowModel
			.findOne<FlowPopulated>({
				_id: input.flowId,
				projectId,
			})
			.populate('version')
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const flowTrigger = flowHelper.getTrigger(flow.version, input.triggerName)
		assertNotNullOrUndefined(flowTrigger, 'flowTrigger')

		if (flowTrigger.type === TriggerType.EMPTY) throw new UnprocessableEntityException(`Can not test empty triggers`)

		await this._deleteOldFilesForTestData({
			flowId: flow._id,
			projectId,
			stepName: flowTrigger.name,
		})

		const { result } = await this.engineService.executeTrigger({
			flowVersion: flow.version,
			hookType: TriggerHookType.TEST,
			triggerName: flowTrigger.name,
			webhookUrl: await this.webhookUrlsService.getWebhookUrl({
				flowId: flow._id,
				simulate: true,
			}),
			projectId,
		})

		if (!result.success) {
			throw new CustomError(result?.message ?? 'Execute trigger failed', ErrorCode.TEST_TRIGGER_FAILED, {
				userMessage: 'Execute trigger failed',
			})
		}

		// delete old event data related to this trigger
		await this.deleteAllRelatedToTrigger({
			flowId: flow._id,
			trigger: flowTrigger,
		})

		const sourceName = this._getSourceName(flowTrigger)
		for (const payload of result.output) {
			await this.saveEvent({
				flowId: flow._id,
				sourceName,
				payload,
				projectId,
			})
		}

		flowTrigger.valid = true
		flowTrigger.settings = {
			...flowTrigger.settings,
			inputUiInfo: {
				currentSelectedData: result.output.pop(),
				lastTestDate: dayjs().format(),
			},
		}

		const flowVersion = await this.flowVersionsService.applyOperation({
			flowVersion: flow.version,
			projectId,
			userId,
			userOperation: {
				type: FlowOperationType.UPDATE_TRIGGER,
				flowVersionId: flow.version._id,
				request: flowTrigger,
			},
		})

		const triggerEvents = await this.findMany({
			flowLike: flow,
			triggerName: flowTrigger.name,
		})

		return {
			triggerEvents,
			flowVersion,
		}
	}

	async watchTriggerEvents(input: WatchTriggerEventsWSInput, projectId: Id, userId: Id, timeoutRequest: boolean) {
		this.logger.log(`#watchTriggerEvents flowId=${input.flowId} triggerName=${input.triggerName}`)
		const flow = await this.flowModel
			.findOne<FlowDocument<'version'>>({
				_id: input.flowId,
				projectId,
			})
			.populate('version')
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const flowTrigger = flowHelper.getTrigger(flow.version, input.triggerName)
		assertNotNullOrUndefined(flowTrigger, 'flowTrigger')

		if (flowTrigger.type === TriggerType.EMPTY) throw new UnprocessableEntityException(`Can not test empty triggers`)

		const sourceName = this._getSourceName(flowTrigger)
		assertNotNullOrUndefined(sourceName, 'sourceName')

		/* disabled now */
		// await this._deleteOldFilesForTestData({
		// 	flowId: flow._id.toString(),
		// 	projectId,
		// 	stepName: flowTrigger.name,
		// })

		// // delete old event data related to this trigger
		// await this.deleteAllRelatedToTrigger({
		// 	flowId: flow._id.toString(),
		// 	trigger: flowTrigger,
		// })

		const listenerKey = `${input.flowId}/${input.triggerName}`
		/* first create database watcher, before webhook enabled, to prevent missing webhooks whihc are send almost at enable */
		this.logger.debug(`#watchTriggerEvents watch for changes with sourceName=${sourceName}`)

		/* to prevent missing data when webhook arrived before added listener */
		let prematureData: WatchTriggerEventsWSResponse
		const changeStreamWatcher = this.triggerEventsModel.collection
			.watch([
				{
					$match: {
						operationType: 'insert',
						'fullDocument.flowId': flow._id,
						'fullDocument.projectId': new mongoose.Types.ObjectId(projectId),
						'fullDocument.sourceName': sourceName,
					},
				},
			])
			.on('change', async (change: InsertNewTrigerEventEvent) => {
				// TODO handle in some way case when handle webhook fails
				// if (!result.success) {
				// 	throw new CustomError(result?.message ?? 'Execute trigger failed', ErrorCode.TEST_TRIGGER_FAILED, {
				// 		userMessage: 'Execute trigger failed',
				// 	})
				// }

				flowTrigger.valid = true
				flowTrigger.settings = {
					...flowTrigger.settings,
					inputUiInfo: {
						currentSelectedData: change.fullDocument.payload,
						lastTestDate: dayjs().format(),
					},
				}

				const flowVersion = await this.flowVersionsService.applyOperation({
					flowVersion: flow.version,
					projectId,
					userId,
					userOperation: {
						type: FlowOperationType.UPDATE_TRIGGER,
						flowVersionId: flow.version._id,
						request: flowTrigger,
					},
				})

				const listener = listeners.get(listenerKey)
				if (listener) {
					listener.resolve({
						triggerEvents: [change.fullDocument],
						flowVersion,
					})
				} else {
					prematureData = {
						triggerEvents: [change.fullDocument],
						flowVersion,
					}
				}
			})
			.on('error', (error) => {
				this.logger.error(`#watchTriggerEvents watch error`, error)
				throw new CustomError(`Can not subscribe to webhook events. Please inform our Team`, ErrorCode.INTERNAL_SERVER, { ...input, sourceName })
			})
		triggerEventsWatchers.set(listenerKey, changeStreamWatcher)

		/* Enable webhook */
		// const lock = await this.webhookSimulationService.createLock({
		// 	flowId: input.flowId,
		// })

		try {
			const webhookSimulationExists = await this.webhookSimulationService.exists({
				flowId: input.flowId,
				projectId,
				flowVersionId: flow.version._id,
			})
			if (webhookSimulationExists) {
				await this.webhookSimulationService.delete({
					flowId: input.flowId,
					projectId,
					flowVersionId: flow.version._id,
					// parentLock: lock,
				})
			}

			await this.webhookSimulationService._preCreateSideEffect({
				flowId: input.flowId,
				projectId,
				flowVersionId: flow.version._id,
			})

			await this.webhookSimulationService.create({
				flowId: input.flowId,
				projectId,
				flowVersionId: flow.version._id,
			})
		} finally {
			/* Disable now dou to error: ExecutionError: The operation was unable to achieve a quorum during its retry window. */
			// await lock.release()
		}

		this.logger.debug(`#watchTriggerEvents add listener listenerKey=${listenerKey}`)
		return async (): Promise<WatchTriggerEventsWSResponse> =>
			new Promise((resolve) => {
				const clearSideEffects = async () => {
					const changeStreamWatcher = triggerEventsWatchers.get(listenerKey)
					await changeStreamWatcher?.close()
					triggerEventsWatchers.delete(listenerKey)
					listeners.delete(listenerKey)
					clearTimeout(timeout)
					/* Webhook simulation endpoint is disabled by webhook handler */
				}

				const listenerHandlers = {
					resolve: async (data: WatchTriggerEventsWSResponse) => {
						await clearSideEffects()
						this.logger.log(`#watchTriggerEvents success listenerKey=${listenerKey}`)
						resolve(data)
					},
					cancel: async () => {
						await clearSideEffects()
						this.logger.log(`#watchTriggerEvents canceled listenerKey=${listenerKey}`)
						resolve('Manula cancelation')
					},
				}

				if (prematureData) listenerHandlers.resolve(prematureData)

				let timeout: NodeJS.Timeout
				if (!timeoutRequest) {
					listeners.set(listenerKey, listenerHandlers)
				} else {
					timeout = setTimeout(async () => {
						this.logger.debug(`#watchTriggerEvents timeout`)
						await clearSideEffects()
						resolve(`Trigger events timeout`)
					}, this.WEBHOOK_TIMEOUT_MS)
					listeners.set(listenerKey, listenerHandlers)
				}
			})
	}

	async cancelTriggerEventsWatcher(input: WatchTriggerEventsWSInput) {
		const listenerKey = `${input.flowId}/${input.triggerName}`

		const listener = listeners.get(listenerKey)
		if (listener) {
			await listener.cancel()
		}
	}

	async getMany(query: GetTriggerEventsQuery, projectId: Id) {
		const flowVersion = await this.flowVersionModel.findOne({
			flow: query.flowId,
			projectId,
		})
		if (!flowVersion) throw new UnprocessableEntityException('Can not retrive flow version')

		const trigger = flowHelper.getTrigger(flowVersion.toObject(), query.triggerName)
		if (!trigger) throw new UnprocessableEntityException('Can not retrive trigger')

		const sourceName = this._getSourceName(trigger)

		return this.triggerEventsModel.find({
			flowId: query.flowId,
			sourceName,
		})
	}

	private _getSourceName(trigger: Trigger) {
		switch (trigger.type) {
			case TriggerType.CONNECTOR:
				return `${trigger.settings.connectorName}@${trigger.settings.connectorVersion}:${trigger.settings.triggerName}`
			case TriggerType.EMPTY:
		}
	}
}
