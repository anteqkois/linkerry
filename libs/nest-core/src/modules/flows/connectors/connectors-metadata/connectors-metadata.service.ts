import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { EXACT_VERSION_PATTERN, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { MongoFilter } from '../../../../lib/mongodb/decorators/filter.decorator'
import { ConnectorMetadataGetManyQueryDto } from './dto/getMany.dto'
import { ConnectorMetadataGetOneQueryDto } from './dto/getOne.dto'
import { ConnectorsMetadataModel } from './schemas/connector.schema'

@Injectable()
export class ConnectorsMetadataService {
	constructor(@InjectModel(ConnectorsMetadataModel.name) private readonly connectorMetadataModel: Model<ConnectorsMetadataModel>) {}

	connectorToSummaryMetadata(connectorMetadata: ConnectorMetadata): ConnectorMetadataSummary {
		return {
			...connectorMetadata,
			actions: Object.keys(connectorMetadata?.actions ?? {}).length,
			triggers: Object.keys(connectorMetadata?.triggers ?? {}).length,
		}
	}

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
			connectors
				.reduce((acc: Map<string, ConnectorMetadata>, curr) => {
					if (acc.has(curr.name)) return acc
					acc.set(curr.name, curr)
					return acc
				}, new Map())
				.values(),
		)

		return query.summary ? distinctConnectors.map((connector) => this.connectorToSummaryMetadata(connector)) : distinctConnectors
	}

	async findOne(name: string, query: ConnectorMetadataGetOneQueryDto) {
		const filter: FilterQuery<ConnectorsMetadataModel> = {
			name,
		}

		if (query.version) filter.version = query.version

		const connector = (await this.connectorMetadataModel.findOne(filter))?.toObject()

		if (!connector) throw new UnprocessableEntityException(`Can not find conector metadata`)

		return query.summary ? this.connectorToSummaryMetadata(connector) : connector
	}

	async getTrigger(connectorName: string, triggerName: string) {
		const connector = await this.connectorMetadataModel.findOne({
			name: connectorName,
		})
		assertNotNullOrUndefined(connector, 'connector')

		const trigger = Object.entries(connector.triggers).find(([name]) => name === triggerName)?.[1]
		assertNotNullOrUndefined(trigger, 'trigger', {
			connectorName,
			triggerName,
		})

		return trigger
	}

	async getExactPieceVersion({
		name,
		version,
	}: // projectId
	{
		name: string
		version: string
		// projectId: Id
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
