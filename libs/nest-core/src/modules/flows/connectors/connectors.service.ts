import { CustomError, ErrorCode, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionsService } from '../flow-versions/flow-versions.service'
import { ConnectorsGetOptionsInputDto } from './dto/get-options-input.dto'

@Injectable()
export class ConnectorsService {
	constructor(private readonly flowVersionsService: FlowVersionsService, private readonly engineService: EngineService) {
		//
	}

	async getPropertyOptions(body: ConnectorsGetOptionsInputDto) {
		const flowVersion = await this.flowVersionsService.findOne({
			filter: {
				_id: body.flowVersionId,
				flow: body.flowId,
			},
		})

		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const { result } = await this.engineService.executeProp({
			connector: {
				connectorName: body.connectorName,
				connectorType: body.connectorType,
				connectorVersion: body.connectorVersion,
			},
			flowVersion,
			input: body.input,
			propertyName: body.propertyName,
			stepName: body.stepName,
		})

		console.log(result)
		if (typeof result === 'string') throw new CustomError(result, ErrorCode.ENGINE_OPERATION_FAILURE)

		return result
	}
}
