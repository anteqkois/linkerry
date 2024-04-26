import { ConnectorNameType, ConnectorsGetOptionsInput, ConnectorsMetadataGetManyQuery, ConnectorsMetadataGetOneQuery, RequestUser } from '@linkerry/shared'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { MongoFilter, QueryToMongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service'
import { ConnectorsService } from './connectors.service'

@Controller('connectors')
export class ConnectorsController {
	constructor(private readonly connectorsMetadataService: ConnectorsMetadataService, private readonly connectorsService: ConnectorsService) {}

	@TypedRoute.Get()
	findAll(
		@QueryToMongoFilter({
			exclude: ['summary'],
		})
		filter: MongoFilter<ConnectorsMetadataGetManyQuery>,
		@TypedQuery() query: ConnectorsMetadataGetManyQuery,
	) {
		return this.connectorsMetadataService.findAllUnique(filter, query)
	}

	@TypedRoute.Get(':name')
	findOne(@TypedParam('name') name: ConnectorNameType, @TypedQuery() query: ConnectorsMetadataGetOneQuery) {
		return this.connectorsMetadataService.findOne(name, query)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post('/options')
	getPropertyOptions(@ReqJwtUser() user: RequestUser, @TypedBody() body: ConnectorsGetOptionsInput) {
		return this.connectorsService.getPropertyOptions(user.projectId, body)
	}
}
