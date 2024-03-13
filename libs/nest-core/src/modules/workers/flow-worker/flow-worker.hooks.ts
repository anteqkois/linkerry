import { Id } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class FlowWorkerHooks {
	private readonly logger = new Logger(FlowWorkerHooks.name)

	async preExecute({projectId, runId}: PreExecuteParams) {
		// Do nothing now
	}
}

export interface PreExecuteParams {
	projectId: Id
	runId: Id
}
