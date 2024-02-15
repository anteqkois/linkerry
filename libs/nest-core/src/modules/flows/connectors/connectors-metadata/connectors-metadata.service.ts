import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { EXACT_VERSION_PATTERN } from '@linkerry/shared'
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

	// async findAll(filter: MongoFilter<ConnectorMetadataGetManyQueryDto>, query: ConnectorMetadataGetManyQueryDto) {
	// 	const connectors = (
	// 		await this.connectorMetadataModel.find(
	// 			filter,
	// 			{},
	// 			{
	// 				sort: {
	// 					name: 'asc',
	// 					version: 'desc',
	// 				},
	// 			},
	// 		)
	// 	).map((connector) => connector.toObject())

	// 	return query.summary ? connectors.map((connector) => this.connectorToSummaryMetadata(connector)) : connectors
	// }

	async findAllUnique(filter: MongoFilter<ConnectorMetadataGetManyQueryDto>, query: ConnectorMetadataGetManyQueryDto) {
		const connectors = (
			await this.connectorMetadataModel.find(
				filter,
				{},
				{
					sort: {
						name: 'asc',
						version: 'desc',
					},
				},
			)
		).map((connector) => connector.toObject())

		const distinctConnectors = Array.from(
			connectors.reduce((acc: Map<string, ConnectorMetadata>, curr) => {
				if (acc.has(curr.name)) return acc
				acc.set(curr.name, curr)
				return acc
			}, new Map()).values(),
		)

		return query.summary ? distinctConnectors.map((connector) => this.connectorToSummaryMetadata(connector)) : distinctConnectors
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

	async getExactPieceVersion({
		name,
		version,
	}: {
		name: string
		version: string
		// projectId: ProjectId
	}): Promise<string> {
		const isExactVersion = EXACT_VERSION_PATTERN.test(version)

		if (isExactVersion) {
			return version
		}

		const pieceMetadata = await this.findOne(name, {
			version,
		})

		return pieceMetadata.version
	}
}
