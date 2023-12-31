import { ConnectorMetadata, ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { Id } from '@market-connector/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoFilter } from '../../lib/mongodb/decorators/filter.decorator'
import { ConnectorMetadataGetManyQueryDto } from './dto/getMany.dto'
import { ConnectorMetadataGetOneQueryDto } from './dto/getOne.dto'
import { ConnectorMetadataModel } from './schemas/connector.schema'

@Injectable()
export class ConnectorsMetadataService {
  constructor(@InjectModel(ConnectorMetadataModel.name) private readonly connectorMetadataModel: Model<ConnectorMetadataModel>) {}

  connectorToSummaryMetadata(connectorMetadata: ConnectorMetadata): ConnectorMetadataSummary {
    return {
      ...connectorMetadata,
      actions: Object.keys(connectorMetadata?.actions ?? {}).length,
      triggers: Object.keys(connectorMetadata?.triggers ?? {}).length,
    }
  }

  async findAll(filter: MongoFilter<ConnectorMetadataGetManyQueryDto>, query: ConnectorMetadataGetManyQueryDto) {
    const connectors = (await this.connectorMetadataModel.find(filter)).map((connector) => connector.toObject())

    return query.summary ? connectors.map((connector) => this.connectorToSummaryMetadata(connector)) : connectors
  }

  async findOne(id: Id, query: ConnectorMetadataGetOneQueryDto) {
    const connector = (
      await this.connectorMetadataModel.findOne({
        _id: id,
      })
    )?.toObject()

    if (!connector) throw new UnprocessableEntityException(`Can not find conector metadata based on id: ${id}`)

    return query.summary ? this.connectorToSummaryMetadata(connector) : connector
  }
}
