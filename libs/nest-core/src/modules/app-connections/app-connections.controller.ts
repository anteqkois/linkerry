import { RequestUser, UpsertAppConnectionInput, upsertAppConnectionInputSchema } from '@linkerry/shared'
import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../lib/auth'
import { BodySchema } from '../../lib/nest-utils/decorators/zod/body'
import { ReqJwtUser } from '../users/auth/decorators/req-jwt-user.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('app-connections')
export class AppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	async find(@ReqJwtUser() user: RequestUser) {
		const appConnections = await this.appConnectionsService.find(user.projectId)
		return appConnections.map(this.appConnectionsService.removeSensitiveData)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	async upsert(@BodySchema(upsertAppConnectionInputSchema) body: UpsertAppConnectionInput, @ReqJwtUser() user: RequestUser) {
		const appConnection = await this.appConnectionsService.upsert(user.projectId, body)
		return this.appConnectionsService.removeSensitiveData(appConnection)
	}
}
