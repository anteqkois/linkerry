import { Controller, Get, Param, Query } from '@nestjs/common'
import { MongoFilter, QueryToMongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service'
import { ConnectorMetadataGetManyQueryDto } from './connectors-metadata/dto/getMany.dto'
import { ConnectorMetadataGetOneQueryDto } from './connectors-metadata/dto/getOne.dto'
import { ConnectorsService } from './connectors.service'

@Controller('connectors')
export class ConnectorsController {
	constructor(private readonly connectorsMetadataService: ConnectorsMetadataService, private readonly connectorsService: ConnectorsService) {}

	@Get()
	findAll(
		@QueryToMongoFilter({
			exclude: ['summary'],
		})
		filter: MongoFilter<ConnectorMetadataGetManyQueryDto>,
		@Query() query: ConnectorMetadataGetManyQueryDto,
	) {
		return this.connectorsMetadataService.findAll(filter, query)
	}

	@Get(':name')
	findOne(@Param('name') name: string, @Query() query: ConnectorMetadataGetOneQueryDto) {
		return this.connectorsMetadataService.findOne(name, query)
	}
}
