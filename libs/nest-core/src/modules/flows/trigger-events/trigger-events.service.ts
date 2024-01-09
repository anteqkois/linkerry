import { Id, TriggerType } from '@market-connector/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { FlowsService } from '../flows/flows.service'
import { StepFilesService } from '../step-files/step-files.service'
import { PoolTestDto } from '../trigger-events/dto/pool-test.dto'

@Injectable()
export class TriggerEventsService {
	constructor(private readonly flowService: FlowsService, private readonly stepFilesService: StepFilesService) {}

	async performPoolTest(poolDto: PoolTestDto, userId: Id) {
		const flow = await this.flowService.findOne(poolDto.flowId, userId)
		if (!flow) throw new UnprocessableEntityException(`Can not retrive flow by given id`)

		const trigger = flow.version.triggers.find((trigger) => trigger.name === poolDto.triggerName)
		if (!trigger) throw new UnprocessableEntityException(`Can not retrive flow trigger by given name`)

		switch (trigger.type) {
			case TriggerType.Webhook:
				throw new UnprocessableEntityException(`Can not test webhook triggers`)
			case TriggerType.Connector:
				// delete old data
				// this.stepFilesService.delete()

				// execute trigger

				// delete old event data

				/* create new event data
				test trigger run produce several outputs. Save it as a event data to give user ability to check more than one example output from pool trigger
				 */

				break
			case TriggerType.Empty:
				throw new UnprocessableEntityException(`Can not test empty triggers`)
		}
	}
}
