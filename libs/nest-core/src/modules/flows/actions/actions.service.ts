import { Id, assertNotNullOrUndefined, flowHelper } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { RunActionDto } from './dto/run.dto'

@Injectable()
export class ActionsService {
	constructor(private readonly engineService: EngineService, private readonly flowVersionsService: FlowVersionsService) {}

	async run(projectId: Id, userId: Id, body: RunActionDto) {
		let flowVersion = await this.flowVersionsService.findOne({
			filter: {
				_id: body.flowVersionId,
				projectId,
			},
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

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

			flowVersion = flowHelper.updateAction(flowVersion, action)
			flowVersion.valid = flowHelper.isValid(flowVersion)
			await this.flowVersionsService.update(flowVersion._id, userId, flowVersion)
		}

		return {
			success: result.success ?? false,
			output: result.output,
			standardError,
			standardOutput,
			flowVersion,
		}
	}
}
