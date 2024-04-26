import { CustomError, ErrorCode, RequestWorker, ShortStringType, isNil } from '@linkerry/shared'
import { TypedParam, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { ReqJwtWorker } from '../users/auth/decorators/req-jwt-worker.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('worker/app-connections')
export class WorkerAppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Get(':name')
	async findOne(@ReqJwtWorker() worker: RequestWorker, @TypedParam('name') connectionName: ShortStringType) {
		const appConnection = await this.appConnectionsService.getOne({ name: connectionName, projectId: worker.projectId })

		if (isNil(appConnection)) {
			throw new CustomError(`Can not find app-connection`, ErrorCode.APP_CONNECTION_NOT_FOUND, {
				connectionName,
			})
		}

		return appConnection
	}
}
