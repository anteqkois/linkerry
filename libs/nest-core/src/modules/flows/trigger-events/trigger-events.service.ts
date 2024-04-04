import {
	CustomError,
	ErrorCode,
	FlowOperationType,
	FlowPopulated,
	Id,
	Trigger,
	TriggerHookType,
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
import { Model } from 'mongoose'
import { WebhookUrlsService } from '../../webhooks/webhook-urls/webhook-urls.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowVersionDocument, FlowVersionModel } from '../flow-versions/schemas/flow-version.schema'
import { FlowDocument, FlowModel } from '../flows/schemas/flow.schema'
import { StepFilesService } from '../step-files/step-files.service'
import { TestDto } from '../trigger-events/dto/pool-test.dto'
import { DeleteDto } from './dto/delete.dto'
import { GetManyDto } from './dto/get-many.dto'
import { TriggerEventModel } from './schemas/trigger-events.schema'
import { InsertNewTrigerEventEvent, SaveTriggerEventInput } from './types'

const listeners = new Map<string, (data: WatchTriggerEventsWSResponse) => void>()
const changeStreamWatchers = new Map<string, ReturnType<Model<FlowDocument>['collection']['watch']>>()

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
		private readonly configService: ConfigService,
	) {
		this.WEBHOOK_TIMEOUT_MS = (+configService.get('WEBHOOK_TIMEOUT_SECONDS') ?? 30) * 1000
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
				_id: data.flowId,
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

	async deleteMany({ flowId, triggerName }: DeleteDto, projectId: Id) {
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

	async test(input: TestDto, projectId: Id, userId: Id) {
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

		const sourceName = this._getSourceName(flowTrigger)
		assertNotNullOrUndefined(sourceName, 'sourceName')
		const listenerKey = `${flow._id}:${sourceName}`

		/* Create database watcher */

		const changeStreamWatcher = this.flowModel.collection
			.watch([
				// {
				// 	$match: {
				// 		operationType: 'insert',
				// 	},
				// },
			])
			.on('change', async (change: InsertNewTrigerEventEvent) => {
				console.log('NEW EVENT')
				console.dir(change, { depth: null })

				await this._deleteOldFilesForTestData({
					flowId: flow._id,
					projectId,
					stepName: flowTrigger.name,
				})

				// TODO handle in some way case when handle webhook fails
				// if (!result.success) {
				// 	throw new CustomError(result?.message ?? 'Execute trigger failed', ErrorCode.TEST_TRIGGER_FAILED, {
				// 		userMessage: 'Execute trigger failed',
				// 	})
				// }

				// delete old event data related to this trigger
				await this.deleteAllRelatedToTrigger({
					flowId: flow._id,
					trigger: flowTrigger,
				})

				// const sourceName = this._getSourceName(flowTrigger)
				// for (const payload of result.output) {
				// 	await this.saveEvent({
				// 		flowId: flow._id,
				// 		sourceName,
				// 		payload,
				// 		projectId,
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
					listener({
						triggerEvents: [change.fullDocument],
						flowVersion,
					})
					listeners.delete(listenerKey)
				}
				this.logger.log(`#watchTriggerEvents remove listenerKey=${listenerKey}`)
			})

		changeStreamWatchers.set(listenerKey, changeStreamWatcher)

		this.logger.debug(`#watchTriggerEvents key=${listenerKey}`)
		return new Promise((resolve, reject) => {
			// const defaultResponse: WatchTriggerEventsWSResponse = {[
			// 	{
			// 		_id: generateId().toString(),
			// 		createdAt: dayjs().toISOString(),
			// 		flowId: flow._id,
			// 		payload: {},
			// 		projectId,
			// 		sourceName,
			// 		updatedAt: dayjs().toISOString(),
			// 	},
			// ]}
			const responseHandler = async (data: WatchTriggerEventsWSResponse) => {
				clearTimeout(timeout)
				const changeStreamWatcher = changeStreamWatchers.get(listenerKey)
				await changeStreamWatcher?.close()
				resolve(data)
			}
			let timeout: NodeJS.Timeout
			if (!timeoutRequest) {
				listeners.set(listenerKey, resolve)
			} else {
				timeout = setTimeout(async () => {
					/* clear watcher and listener */
					const changeStreamWatcher = changeStreamWatchers.get(listenerKey)
					await changeStreamWatcher?.close()
					listeners.delete(listenerKey)

					reject(new CustomError(`Trigger events timeout`, ErrorCode.EXECUTION_TIMEOUT, input))
				}, this.WEBHOOK_TIMEOUT_MS)
				listeners.set(listenerKey, responseHandler)
			}
		})

		// const this.changeStream = this.postsModel.collection
		// .watch([
		// 	{
		// 		$match: {
		// 			operationType: 'insert',
		// 		},
		// 	},
		// ])
		// .on('change', this.processChangeStream.bind(this));

		// await this._deleteOldFilesForTestData({
		// 	flowId: flow._id,
		// 	projectId,
		// 	stepName: flowTrigger.name,
		// })

		// const { result } = await this.engineService.executeTrigger({
		// 	flowVersion: flow.version,
		// 	hookType: TriggerHookType.TEST,
		// 	triggerName: flowTrigger.name,
		// 	webhookUrl: await this.webhookUrlsService.getWebhookUrl({
		// 		flowId: flow._id,
		// 		simulate: true,
		// 	}),
		// 	projectId,
		// })

		// if (!result.success) {
		// 	throw new CustomError(result?.message ?? 'Execute trigger failed', ErrorCode.TEST_TRIGGER_FAILED, {
		// 		userMessage: 'Execute trigger failed',
		// 	})
		// }

		// // delete old event data related to this trigger
		// await this.deleteAllRelatedToTrigger({
		// 	flowId: flow._id,
		// 	trigger: flowTrigger,
		// })

		// const sourceName = this._getSourceName(flowTrigger)
		// for (const payload of result.output) {
		// 	await this.saveEvent({
		// 		flowId: flow._id,
		// 		sourceName,
		// 		payload,
		// 		projectId,
		// 	})
		// }

		// flowTrigger.valid = true
		// flowTrigger.settings = {
		// 	...flowTrigger.settings,
		// 	inputUiInfo: {
		// 		currentSelectedData: result.output.pop(),
		// 		lastTestDate: dayjs().format(),
		// 	},
		// }

		// const flowVersion = await this.flowVersionsService.applyOperation({
		// 	flowVersion: flow.version,
		// 	projectId,
		// 	userId,
		// 	userOperation: {
		// 		type: FlowOperationType.UPDATE_TRIGGER,
		// 		flowVersionId: flow.version._id,
		// 		request: flowTrigger,
		// 	},
		// })

		// const triggerEvents = await this.findMany({
		// 	flowLike: flow,
		// 	triggerName: flowTrigger.name,
		// })

		// return {
		// 	triggerEvents,
		// 	flowVersion,
		// }
	}

	async getMany(query: GetManyDto, projectId: Id) {
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
