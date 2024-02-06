import { Id, assertNotNullOrUndefined, flowHelper } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { RunActionDto } from './dto/run.dto'

@Injectable()
export class ActionsService {
	constructor(private readonly engineService: EngineService, private readonly flowVersionsService: FlowVersionsService) {}

	async run(runDto: RunActionDto, userId: Id) {
		const flowVersion = await this.flowVersionsService.findOne({
			filter: {
				_id: runDto.flowVersionId,
				user: userId,
			},
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const action = flowHelper.getAction(flowVersion, runDto.actionName)
		assertNotNullOrUndefined(action, 'action')

		const { result, standardError, standardOutput } = await this.engineService.executeAction({
			flowVersion,
			stepName: runDto.actionName,
		})

		return {
			success: result.success,
			output: result.output,
			standardError,
			standardOutput,
		}
	}
}
