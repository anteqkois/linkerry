import { ConnectorsGetOptionsInput, CustomError, ErrorCode, Id, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EngineService } from '../../engine/engine.service'
import { FlowVersionDocument, FlowVersionModel } from '../flow-versions/schemas/flow-version.schema'
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service'

@Injectable()
export class ConnectorsService {
  constructor(
    @InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
    private readonly engineService: EngineService,
    private readonly connectorsMetadataService: ConnectorsMetadataService,
  ) {}

  async getPropertyOptions(projectId: Id, body: ConnectorsGetOptionsInput) {
    const flowVersion = await this.flowVersionModel.findOne({
      _id: body.flowVersionId,
      flowId: body.flowId,
    })

    assertNotNullOrUndefined(flowVersion, 'flowVersion')

    const { result } = await this.engineService.executeProp({
      connector: await this.connectorsMetadataService.getConnectorPackage(projectId, {
        packageType: body.packageType,
        connectorName: body.connectorName,
        connectorType: body.connectorType,
        connectorVersion: body.connectorVersion,
      }),
      projectId,
      flowVersion: flowVersion.toObject(),
      input: body.input,
      propertyName: body.propertyName,
      stepName: body.stepName,
      searchValue: body.searchValue,
    })

    if (typeof result === 'string') throw new CustomError(result, ErrorCode.ENGINE_OPERATION_FAILURE)
    return result
  }
}
