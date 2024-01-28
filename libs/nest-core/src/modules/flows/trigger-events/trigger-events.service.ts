import { CustomError, ErrorCode, Flow, Id, Trigger, TriggerEvent, TriggerHookType, TriggerType, WithoutId, flowHelper } from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
import { FlowsService } from '../flows/flows.service'
// import { StepFilesService } from '../step-files/step-files.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PoolTestDto } from '../trigger-events/dto/pool-test.dto'
import { TriggerEventModel } from './schemas/trigger-events.schema'

@Injectable()
export class TriggerEventsService {
	constructor(
		private readonly flowService: FlowsService,
		// private readonly stepFilesService: StepFilesService,
		private readonly engineService: EngineService,
		@InjectModel(TriggerEventModel.name) private readonly triggerEventsModel: Model<TriggerEventModel>,
	) {}

	private _deleteEventBasedOnSourceName({ flowId, sourceName }: { flowId: Id; sourceName: string }) {
		return this.triggerEventsModel.deleteMany({
			flowId,
			sourceName,
		})
	}

	create(data: WithoutId<TriggerEvent>) {
		return this.triggerEventsModel.create(data)
	}

	async findMany({ flowLike, triggerName }: { flowLike: Id | Flow; triggerName: string }) {
		const flow = typeof flowLike === 'string' ? await this.flowService.findOne(flowLike) : flowLike
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const trigger = flowHelper.getTrigger(flow.version, triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive trigger by name`)

		const sourceName = this._getSourceName(trigger)
		return this.triggerEventsModel.find({
			flowId: flow._id,
			sourceName,
		})
	}

	async performPoolTest(poolDto: PoolTestDto, userId: Id) {
		const flow = await this.flowService.findOne(poolDto.flowId, userId)
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)
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
		})

		if (!result.success) {
			throw new CustomError({
				code: ErrorCode.TEST_TRIGGER_FAILED,
				params: {
					message: result.message,
				},
			})
		}

		// delete old event data related to this trigger
		const sourceName = this._getSourceName(flowTrigger)
		await this._deleteEventBasedOnSourceName({
			flowId: flow.id,
			sourceName,
		})

		for (const payload of result.output) {
			await this.create({
				flowId: flow.id,
				sourceName,
				payload,
			})
		}

		return this.findMany({
			flowLike: flow,
			triggerName: flowTrigger.name,
		})
	}

	private _getSourceName(trigger: Trigger) {
		switch (trigger.type) {
			case TriggerType.CONNECTOR:
				return `${trigger.settings.connectorName}@${trigger.settings.connectorVersion}:${trigger.settings.triggerName}`
			case TriggerType.EMPTY:
			case TriggerType.WEBHOOK:
				throw new UnprocessableEntityException(`Can not test EMPTY/WEBHOOK triggers`)
		}
	}
}
