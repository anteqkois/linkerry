import { CustomError, ErrorCode, RequestWorker, isNil, stringShortSchema } from '@linkerry/shared'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { ParamSchema } from '../../lib/nest-utils/decorators/zod/param'
import { ReqJwtWorker } from '../users/auth/decorators/req-jwt-worker.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('worker/app-connections')
export class WorkerAppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Get(':name')
	async findOne(@ParamSchema('name', stringShortSchema) connectionName: string, @ReqJwtWorker() worker: RequestWorker) {
		const appConnection = await this.appConnectionsService.getOne({ name: connectionName, projectId: worker.projectId })

		if (isNil(appConnection)) {
			throw new CustomError(`Can not find app-connection`, ErrorCode.APP_CONNECTION_NOT_FOUND, {
				connectionName,
			})
		}

		return appConnection
	}
}
