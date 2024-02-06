import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { MongoFilter } from '../../../../lib/mongodb/decorators/filter.decorator'
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

	async findOne(name: string, query: ConnectorMetadataGetOneQueryDto) {
		const filter: FilterQuery<ConnectorMetadataModel> = {
			name,
		}

		if (query.version) filter.version = query.version

		const connector = (await this.connectorMetadataModel.findOne(filter))?.toObject()

		if (!connector) throw new UnprocessableEntityException(`Can not find conector metadata`)

		return query.summary ? this.connectorToSummaryMetadata(connector) : connector
	}
}
