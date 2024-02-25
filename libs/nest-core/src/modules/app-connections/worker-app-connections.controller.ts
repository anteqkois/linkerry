import { CustomError, ErrorCode, RequestWorker, isNil } from '@linkerry/shared'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { ReqJwtWorker } from '../users/auth/decorators/req-jwt-worker.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('worker/app-connections')
export class WorkerAppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Get(':name')
	async findOne(@ReqJwtWorker() worker: RequestWorker, @Param('name') connectionName: string) {
		const appConnection = await this.appConnectionsService.findOne({ name: connectionName, projectId: worker.projectId })

		if (isNil(appConnection)) {
			throw new CustomError(`Can not find app-connection`, ErrorCode.APP_CONNECTION_NOT_FOUND, {
				connectionName,
			})
		}

		return appConnection
	}
}
