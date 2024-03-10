import { CustomError, ErrorCode, Id, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionDocument, FlowVersionModel } from '../flow-versions/schemas/flow-version.schema'
import { ConnectorsGetOptionsInputDto } from './dto/get-options-input.dto'

@Injectable()
export class ConnectorsService {
	constructor(
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly engineService: EngineService,
	) {}

	async getPropertyOptions(projectId: Id, body: ConnectorsGetOptionsInputDto) {
		const flowVersion = await this.flowVersionModel.findOne({
			_id: body.flowVersionId,
			flow: body.flowId,
		})

		assertNotNullOrUndefined(flowVersion, 'flowVersion')

		const { result } = await this.engineService.executeProp({
			connector: {
				connectorName: body.connectorName,
				connectorType: body.connectorType,
				connectorVersion: body.connectorVersion,
			},
			projectId,
			flowVersion: flowVersion.toObject(),
			input: body.input,
			propertyName: body.propertyName,
			stepName: body.stepName,
		})

		if (typeof result === 'string') throw new CustomError(result, ErrorCode.ENGINE_OPERATION_FAILURE)
		return result
	}
}
