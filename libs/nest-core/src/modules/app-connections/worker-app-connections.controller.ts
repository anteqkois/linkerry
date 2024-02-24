import { RequestWorker } from '@linkerry/shared'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { ReqJwtWorker } from '../../lib/auth/decorators/req-worker.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('worker/app-connections')
export class WorkerAppConnectionsController {
	constructor(private readonly appConnectionsService: AppConnectionsService) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Get(':connectionName')
	async find(@ReqJwtWorker() worker: RequestWorker) {
		return worker
		// const appConnections = await this.appConnectionsService.findOne(user.id)
		// return appConnections.map(this.appConnectionsService.removeSensitiveData)
	}
}
