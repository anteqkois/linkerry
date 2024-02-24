import { RequestUser, UpsertAppConnectionInput } from '@linkerry/shared'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../lib/auth'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('app-connections')
export class AppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	async find(@ReqJwtUser() user: RequestUser) {
		const appConnections = await this.appConnectionsService.find(user.id)
		return appConnections.map(this.appConnectionsService.removeSensitiveData)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	async upsert(@ReqJwtUser() user: RequestUser, @Body() body: UpsertAppConnectionInput) {
		const appConnection = await this.appConnectionsService.upsert(user.id, body)
		return this.appConnectionsService.removeSensitiveData(appConnection)
	}
}
