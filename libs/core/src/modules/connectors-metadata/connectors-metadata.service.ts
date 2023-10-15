import { Injectable } from '@nestjs/common'
import { CreateDto } from './dto/create.dto'
import { UpdateDto } from './dto/update.dto'
import { Id } from '@market-connector/shared'
import { Model } from 'mongoose'
import { ConnectorMetadataModel } from './schemas/connector.schema'
import { InjectModel } from '@nestjs/mongoose'
import { ConnectorMetadata, ConnectorMetadataSummary } from '@market-connector/connectors-framework'

@Injectable()
export class ConnectorsMetadataService {
  constructor(@InjectModel(ConnectorMetadataModel.name) private readonly connectorMetadataModel: Model<ConnectorMetadataModel>) {}

  toSummaryMetadata(connectorMetadata: ConnectorMetadata): ConnectorMetadataSummary {
    return {
      ...connectorMetadata,
      actions: Object.keys(connectorMetadata.actions).length,
      triggers: Object.keys(connectorMetadata.triggers).length,
    }
  }

  async create(createDto: CreateDto) {
    return this.connectorMetadataModel.create({
      ...CreateDto,
    })
  }

  async seed(createDto: CreateDto) {
    return this.connectorMetadataModel.create({
      ...CreateDto,
    })
  }

  async findAll() {
    const connectors = await this.connectorMetadataModel.find()
    return connectors.map((connector) => this.toSummaryMetadata(connector))
  }

  async findOne(id: Id) {
    return this.connectorMetadataModel.findOne({
      _id: id,
    })
  }

  // async update(id: number, updateConnectorsMetadatumDto: UpdateDto) {
  //   return `This action updates a #${id} connectorsMetadatum`
  // }

  // async remove(id: number) {
  //   return `This action removes a #${id} connectorsMetadatum`
  // }
}
