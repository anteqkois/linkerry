import { ConnectorsGetOptionsInput, ConnectorsMetadataGetManyQuery, ConnectorsMetadataGetOneQuery, RequestUser, connectorsGetOptionsInputSchema, connectorsMetadataGetManyQuerySchema, connectorsMetadataGetOneQuerySchema, stringShortSchema } from '@linkerry/shared'
import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { ParamSchema } from '../../../lib/nest-utils/decorators/zod/param'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service'
import { ConnectorsService } from './connectors.service'

@Controller('connectors')
export class ConnectorsController {
	constructor(private readonly connectorsMetadataService: ConnectorsMetadataService, private readonly connectorsService: ConnectorsService) {}

	@Get()
	findAll(@QuerySchema(connectorsMetadataGetManyQuerySchema) query: ConnectorsMetadataGetManyQuery) {
		return this.connectorsMetadataService.findAllUnique(query)
	}

	@Get(':name')
	findOne(@ParamSchema('name', stringShortSchema) name: string, @QuerySchema(connectorsMetadataGetOneQuerySchema) query: ConnectorsMetadataGetOneQuery) {
		return this.connectorsMetadataService.findOne(name, query)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post('/options')
	getPropertyOptions(@BodySchema(connectorsGetOptionsInputSchema) body: ConnectorsGetOptionsInput, @ReqJwtUser() user: RequestUser) {
		return this.connectorsService.getPropertyOptions(user.projectId, body)
	}
}
