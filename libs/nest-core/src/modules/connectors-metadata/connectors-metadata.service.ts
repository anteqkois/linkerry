import { ConnectorMetadata, ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { Id } from '@market-connector/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateDto } from './dto/create.dto'
import { ConnectorMetadataModel } from './schemas/connector.schema'

@Injectable()
export class ConnectorsMetadataService {
  constructor(@InjectModel(ConnectorMetadataModel.name) private readonly connectorMetadataModel: Model<ConnectorMetadataModel>) {}

  connectorToSummaryMetadata(connectorMetadata: ConnectorMetadata): ConnectorMetadataSummary {
    return {
      ...connectorMetadata,
      actions: Object.keys(connectorMetadata.actions).length,
      triggers: Object.keys(connectorMetadata.triggers).length,
    }
  }

  async create(createDto: CreateDto) {
    return this.connectorMetadataModel.create({
      ...createDto,
    })
  }

  async findAll() {
    const connectors = await this.connectorMetadataModel.find()
    return connectors.map((connector) => this.connectorToSummaryMetadata(connector))
  }

  async findOne(id: Id) {
    return this.connectorMetadataModel.findOne({
      _id: id,
    })
  }
}
