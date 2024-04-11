import { RequestUser } from '@linkerry/shared'
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { MongoFilter, QueryToMongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service'
import { ConnectorMetadataGetManyQueryDto } from './connectors-metadata/dto/getMany.dto'
import { ConnectorMetadataGetOneQueryDto } from './connectors-metadata/dto/getOne.dto'
import { ConnectorsService } from './connectors.service'
import { ConnectorsGetOptionsInputDto } from './dto/get-options-input.dto'

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
		return this.connectorsMetadataService.findAllUnique(filter, query)
	}

	@Get(':name')
	findOne(@Param('name') name: string, @Query() query: ConnectorMetadataGetOneQueryDto) {
		return this.connectorsMetadataService.findOne(name, query)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post('/options')
	getPropertyOptions(@ReqJwtUser() user: RequestUser, @Body() body: ConnectorsGetOptionsInputDto) {
		return this.connectorsService.getPropertyOptions(user.projectId, body)
	}
}
