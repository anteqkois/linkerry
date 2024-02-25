import { CustomError, ErrorCode, Flow, Id, Trigger, TriggerEvent, TriggerHookType, TriggerType, WithoutId, flowHelper } from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
import { FlowsService } from '../flows/flows.service'
// import { StepFilesService } from '../step-files/step-files.service'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { PoolTestDto } from '../trigger-events/dto/pool-test.dto'
import { DeleteDto } from './dto/delete.dto'
import { GetManyDto } from './dto/get-many.dto'
import { TriggerEventModel } from './schemas/trigger-events.schema'

@Injectable()
export class TriggerEventsService {
	constructor(
		private readonly flowService: FlowsService,
		private readonly flowVersionsService: FlowVersionsService,
		// private readonly stepFilesService: StepFilesService,
		private readonly engineService: EngineService,
		@InjectModel(TriggerEventModel.name) private readonly triggerEventsModel: Model<TriggerEventModel>,
	) {}

	async deleteAllRelatedToTrigger({ flowId, trigger }: { flowId: Id; trigger: Trigger }) {
		const sourceName = this._getSourceName(trigger)
		return this.triggerEventsModel.deleteMany({
			flowId,
			sourceName,
		})
	}

	create(data: WithoutId<TriggerEvent>) {
		return this.triggerEventsModel.create(data)
	}

	async findMany({ flowLike, triggerName }: { flowLike: Id | Flow; triggerName: string }) {
		const flow =
			typeof flowLike === 'string'
				? await this.flowService.findOne({
						filter: {
							_id: flowLike,
						},
				  })
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
		const flow = await this.flowService.findOne({
			filter: {
				_id: flowId,
				projectId,
			},
		})
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const trigger = flowHelper.getTrigger(flow.version, triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger by name`)

		return this.deleteAllRelatedToTrigger({
			flowId,
			trigger,
		})
	}

	async performPoolTest(poolDto: PoolTestDto, projectId: Id) {
		const flow = await this.flowService.findOne({
			filter: {
				_id: poolDto.flowId,
				projectId,
			},
		})
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const flowTrigger = flowHelper.getTrigger(flow.version, poolDto.triggerName)
		if (!flowTrigger) throw new UnprocessableEntityException(`Can not retrive flow trigger by given name`)

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
			flowId: flow.id,
			trigger: flowTrigger,
		})

		const sourceName = this._getSourceName(flowTrigger)
		for (const payload of result.output) {
			await this.create({
				flowId: flow.id,
				sourceName,
				payload,
				projectId,
			})
		}

		await this.flowVersionsService.patchTrigger({
			projectId,
			flowVersionId: flow.version._id,
			triggerName: flowTrigger.name,
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

		return this.findMany({
			flowLike: flow,
			triggerName: flowTrigger.name,
		})
	}

	async getMany(query: GetManyDto, projectId: Id) {
		const flowVersion = await this.flowVersionsService.findOne({
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
