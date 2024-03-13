import { Injectable, Logger } from '@nestjs/common'
import { generateId } from '../../../lib/mongodb'

// /Users/anteqkois/Code/Projects/me/activepieces/packages/server/api/src/app/flows/flow-run/flow-response-watcher.ts
@Injectable()
export class FlowResponseService {
	private readonly logger = new Logger(FlowResponseService.name)

	constructor(
		// @InjectModel(FlowRunModel.name) private readonly flowRunModel: Model<FlowRunModel>,
		// private readonly queueJobsService: QueueJobsService,
		// private readonly flowVersionsService: FlowVersionsService,
		// private readonly flowsService: FlowsService,
		// private readonly flowRunsHooks: FlowRunsHooks,
	) {
		//
	}

	getHandlerId(): string {
		return generateId().toString()
}

}
