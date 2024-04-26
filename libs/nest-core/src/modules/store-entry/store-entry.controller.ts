import { PutStoreEntryRequest, RequestWorker } from '@linkerry/shared'
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { ReqJwtWorker } from '../users/auth/decorators/req-jwt-worker.decorator'
import { StoreEntryService } from './store-entry.service'

@Controller('store-entries')
export class StoreEntryController {
	constructor(private readonly storeEntryService: StoreEntryService) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Get()
	findOne(@ReqJwtWorker() worker: RequestWorker, @TypedQuery() query: { key: string }) {
		return this.storeEntryService.findOne(worker.projectId, query.key)
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Post()
	upsert(@ReqJwtWorker() worker: RequestWorker, @TypedBody() body: PutStoreEntryRequest) {
		return this.storeEntryService.upsert(worker.projectId, body.key, body.value)
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Delete()
	deleteOne(@ReqJwtWorker() worker: RequestWorker, @TypedQuery() query: { key: string }) {
		return this.storeEntryService.deleteOne(worker.projectId, query.key)
	}
}
