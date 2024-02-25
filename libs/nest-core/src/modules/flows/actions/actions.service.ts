import { Id, assertNotNullOrUndefined, flowHelper } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { RunActionDto } from './dto/run.dto'

@Injectable()
export class ActionsService {
	constructor(private readonly engineService: EngineService, private readonly flowVersionsService: FlowVersionsService) {}

	async run(projectId: Id, body: RunActionDto) {
		const flowVersion = await this.flowVersionsService.findOne({
			filter: {
				_id: body.flowVersionId,
				projectId,
			},
		})
		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const action = flowHelper.getAction(flowVersion, body.actionName)
		assertNotNullOrUndefined(action, 'action')

		const { result, standardError, standardOutput } = await this.engineService.executeAction({
			flowVersion,
			stepName: body.actionName,
			projectId,
		})

		return {
			success: result.success ?? false,
			output: result.output,
			standardError,
			standardOutput,
		}
	}
}
