import { PutStoreEntryRequest, RequestWorker, putStoreEntryRequestSchema, stringShortSchema } from '@linkerry/shared'
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { BodySchema } from '../../lib/nest-utils/decorators/zod/body.decorator'
import { QuerySchema } from '../../lib/nest-utils/decorators/zod/query.decorator'
import { ReqJwtWorker } from '../users/auth/decorators/req-jwt-worker.decorator'
import { StoreEntryService } from './store-entry.service'

@Controller('store-entries')
export class StoreEntryController {
  constructor(private readonly storeEntryService: StoreEntryService) {}

  @UseGuards(JwtBearerTokenAuthGuard)
  @Get()
  findOne(@QuerySchema('key', stringShortSchema) key: string, @ReqJwtWorker() worker: RequestWorker) {
    return this.storeEntryService.findOne(worker.projectId, key)
  }

  @UseGuards(JwtBearerTokenAuthGuard)
  @Post()
  upsert(@BodySchema(putStoreEntryRequestSchema) body: PutStoreEntryRequest, @ReqJwtWorker() worker: RequestWorker) {
    return this.storeEntryService.upsert(worker.projectId, body.key, body.value)
  }

  @UseGuards(JwtBearerTokenAuthGuard)
  @Delete()
  deleteOne(@QuerySchema('key', stringShortSchema) key: string, @ReqJwtWorker() worker: RequestWorker) {
    return this.storeEntryService.deleteOne(worker.projectId, key)
  }
}
