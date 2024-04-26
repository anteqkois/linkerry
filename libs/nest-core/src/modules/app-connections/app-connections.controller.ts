import { RequestUser, UpsertAppConnectionInput } from '@linkerry/shared';
import { TypedRoute } from "@nestia/core";
import { Body, Controller, UseGuards } from '@nestjs/common';
import { JwtCookiesAuthGuard } from '../../lib/auth';
import { ReqJwtUser } from '../users/auth/decorators/req-jwt-user.decorator';
import { AppConnectionsService } from './app-connections.service';

@Controller('app-connections')
export class AppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	async findMany(@ReqJwtUser() user: RequestUser) {
		const appConnections = await this.appConnectionsService.find(user.projectId)
		return appConnections.map(this.appConnectionsService.removeSensitiveData)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post()
	async upsert(@ReqJwtUser() user: RequestUser, @Body() body: UpsertAppConnectionInput) {
		const appConnection = await this.appConnectionsService.upsert(user.projectId, body)
		return this.appConnectionsService.removeSensitiveData(appConnection)
	}
}
