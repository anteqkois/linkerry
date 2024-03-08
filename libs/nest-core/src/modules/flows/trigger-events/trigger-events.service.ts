import {
	CustomError,
	ErrorCode,
	Id,
	PopulatedFlow,
	Trigger,
	TriggerHookType,
	TriggerType,
	assertNotNullOrUndefined,
	flowHelper,
} from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
// import { StepFilesService } from '../step-files/step-files.service'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { FlowVersionModel } from '../flow-versions/schemas/flow-version.schema'
import { FlowModel } from '../flows/schemas/flow.schema'
import { TestDto } from '../trigger-events/dto/pool-test.dto'
import { DeleteDto } from './dto/delete.dto'
import { GetManyDto } from './dto/get-many.dto'
import { TriggerEventModel } from './schemas/trigger-events.schema'
import { SaveTriggerEventInput } from './types'

@Injectable()
export class TriggerEventsService {
	constructor(
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowModel>,
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionModel>,
		@InjectModel(TriggerEventModel.name) private readonly triggerEventsModel: Model<TriggerEventModel>,
		private readonly flowVersionsService: FlowVersionsService,
		private readonly engineService: EngineService,
	) {}

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
				filter: {
					_id: data.flowId,
					projectId: data.projectId,
				},
			})

			assertNotNullOrUndefined(flowVersion, 'flowVersion')

			// TODO handle many triggers
			data.sourceName = this._getSourceName(flowVersion.triggers[0])
		}

		return this.triggerEventsModel.create(data)
	}

	async findMany({ flowLike, triggerName }: { flowLike: Id | PopulatedFlow; triggerName: string }) {
		const flow =
			typeof flowLike === 'string'
				? await this.flowModel
						.findOne<PopulatedFlow>({
							filter: {
								_id: flowLike,
							},
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
			.findOne<PopulatedFlow>({
				filter: {
					_id: flowId,
					projectId,
				},
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
			.findOne<PopulatedFlow>({
				filter: {
					_id: input.flowId,
					projectId,
				},
			})
			.populate('version')
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const flowTrigger = flowHelper.getTrigger(flow.version, input.triggerName)
		assertNotNullOrUndefined(flowTrigger, 'flowTrigger')

		if (flowTrigger.type === TriggerType.WEBHOOK) throw new UnprocessableEntityException(`Can not test webhook triggers`)
		if (flowTrigger.type === TriggerType.EMPTY) throw new UnprocessableEntityException(`Can not test empty triggers`)

		// delete old data
		// this.stepFilesService.delete()

		const { result } = await this.engineService.executeTrigger({
			flowVersion: flow.version,
			hookType: TriggerHookType.TEST,
			triggerName: flowTrigger.name,
			webhookUrl: '', // TODO implement webhook url
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

		const flowVersion = await this.flowVersionsService.patchTrigger({
			projectId,
			flowVersionId: flow.version._id,
			triggerName: flowTrigger.name,
			userId,
			trigger: {
				valid: true,
				settings: {
					inputUiInfo: {
						currentSelectedData: result.output.pop(),
						lastTestDate: dayjs().format(),
					},
				},
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

	async getMany(query: GetManyDto, projectId: Id) {
		const flowVersion = await this.flowVersionModel.findOne({
			filter: {
				flow: query.flowId,
				projectId,
			},
		})
		if (!flowVersion) throw new UnprocessableEntityException('Can not retrive flow version')

		const trigger = flowHelper.getTrigger(flowVersion, query.triggerName)
		if (!trigger) throw new UnprocessableEntityException('Can not retrive trigger')

		const sourceName = this._getSourceName(trigger)

		return this.triggerEventsModel.find({
			flowId: query.flowId,
			sourceName,
		})
	}

	private _getSourceName(trigger: Trigger) {
		switch (trigger.type) {
			case TriggerType.TRIGGER:
				return `${trigger.settings.connectorName}@${trigger.settings.connectorVersion}:${trigger.settings.triggerName}`
			case TriggerType.EMPTY:
			case TriggerType.WEBHOOK:
				throw new UnprocessableEntityException(`Can not test EMPTY/WEBHOOK triggers`)
		}
	}
}
