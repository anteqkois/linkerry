import {
  AppCpnnectionsGetManyQuery,
  Id,
  RequestUser,
  UpsertAppConnectionInput,
  appCpnnectionsGetManyQuerySchema,
  upsertAppConnectionInputSchema,
} from '@linkerry/shared'
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../lib/auth'
import { StrictRateLimit } from '../../lib/nest-utils/decorators/stricy-rate-limit.decorator'
import { BodySchema } from '../../lib/nest-utils/decorators/zod/body.decorator'
import { ParamIdSchema } from '../../lib/nest-utils/decorators/zod/id.decorator'
import { QuerySchema } from '../../lib/nest-utils/decorators/zod/query.decorator'
import { ReqJwtUser } from '../users/auth/decorators/req-jwt-user.decorator'
import { AppConnectionsService } from './app-connections.service'

@Controller('app-connections')
export class AppConnectionsController {
  constructor(private readonly appConnectionsService: AppConnectionsService) {}

  @UseGuards(JwtCookiesAuthGuard)
  @Get()
  async find(@QuerySchema(appCpnnectionsGetManyQuerySchema) query: AppCpnnectionsGetManyQuery, @ReqJwtUser() user: RequestUser) {
    const appConnections = await this.appConnectionsService.find(user.projectId, query)
    return appConnections.map((connection) => this.appConnectionsService.removeSensitiveData(connection))
  }

  @StrictRateLimit()
  @UseGuards(JwtCookiesAuthGuard)
  @Post()
  async upsert(@BodySchema(upsertAppConnectionInputSchema) body: UpsertAppConnectionInput, @ReqJwtUser() user: RequestUser) {
    const appConnection = await this.appConnectionsService.upsert(user.projectId, body)
    return this.appConnectionsService.removeSensitiveData(appConnection)
  }

  @UseGuards(JwtCookiesAuthGuard)
  @Delete(':id')
  async delete(@ParamIdSchema() id: Id, @ReqJwtUser() user: RequestUser) {
    await this.appConnectionsService.delete(id, user.projectId)
    return { success: true }
  }
}
