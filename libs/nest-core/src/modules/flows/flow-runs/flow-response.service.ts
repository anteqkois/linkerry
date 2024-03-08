import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { generateId } from '../../../lib/mongodb'

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
