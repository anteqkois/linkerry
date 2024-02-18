import { RequestUser, UpsertAppConnectionBody } from '@linkerry/shared'
import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../lib/auth'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('connections')
export class AppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async find(@ReqJwtUser() user: RequestUser) {
		const appConnections = await this.appConnectionsService.find(user.id)
		return appConnections.map(this.appConnectionsService.removeSensitiveData)
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	async upsert(@ReqJwtUser() user: RequestUser, body: UpsertAppConnectionBody) {
		const appConnection = await this.appConnectionsService.upsert(user.id, body)
		return this.appConnectionsService.removeSensitiveData(appConnection)
	}
}
