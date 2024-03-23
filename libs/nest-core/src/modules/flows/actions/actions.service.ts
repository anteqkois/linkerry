import { FlowOperationType, FlowVersion, Id, assertNotNullOrUndefined, flowHelper } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { RunActionDto } from './dto/run.dto'

@Injectable()
export class ActionsService {
	constructor(private readonly engineService: EngineService, private readonly flowVersionsService: FlowVersionsService) {}

	async run(projectId: Id, userId: Id, body: RunActionDto) {
		let flowVersion = (
			await this.flowVersionsService.findOne({
				filter: {
					_id: body.flowVersionId,
					projectId,
				},
			})
		)?.toObject<FlowVersion>()
		assertNotNullOrUndefined(flowVersion, 'flowVersionObject')

		const { result, standardError, standardOutput } = await this.engineService.executeAction({
			flowVersion,
			stepName: body.actionName,
			projectId,
		})

		if (result.success) {
			const action = flowHelper.getAction(flowVersion, body.actionName)
			assertNotNullOrUndefined(action, 'action')

			action.settings.inputUiInfo = {
				currentSelectedData: result.output,
				lastTestDate: dayjs().format(),
			}
			action.valid = true

			flowVersion = await this.flowVersionsService.applyOperation({
				flowVersion,
				projectId,
				userId,
				userOperation: {
					type: FlowOperationType.UPDATE_ACTION,
					flowVersionId: flowVersion._id,
					request: action,
				},
			})

			return {
				success: result.success,
				output: result.output,
				standardError,
				standardOutput,
				flowVersion,
			}
		}

		return {
			success: result.success,
			output: result.output,
			standardError,
			standardOutput,
		}
	}
}
