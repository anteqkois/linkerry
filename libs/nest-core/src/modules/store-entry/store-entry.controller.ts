import { PutStoreEntryRequest, RequestWorker } from '@linkerry/shared'
import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { ReqJwtWorker } from '../users/auth'
import { StoreEntryService } from './store-entry.service'

@Controller('store-entries')
export class StoreEntryController {
	constructor(private readonly storeEntryService: StoreEntryService) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Get()
	findOne(@ReqJwtWorker() worker: RequestWorker, @Query('key') key: string) {
		return this.storeEntryService.findOne(worker.projectId, key)
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Post()
	upsert(@ReqJwtWorker() worker: RequestWorker, @Body() body: PutStoreEntryRequest) {
		return this.storeEntryService.upsert(worker.projectId, body.key, body.value)
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Delete()
	deleteOne(@ReqJwtWorker() worker: RequestWorker, @Query('key') key: string) {
		return this.storeEntryService.deleteOne(worker.projectId, key)
	}
}
