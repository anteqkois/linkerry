import { FlowRunsGetManyQuery, Id, RequestUser, flowRunsGetManyQuerySchema } from '@linkerry/shared'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ParamIdSchema } from '../../../lib/nest-utils/decorators/zod/id.decorator'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query.decorator'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowRunsService } from './flow-runs.service'

@Controller('flow-runs')
export class FlowRunsController {
  constructor(private readonly flowRunsService: FlowRunsService) {}

  @UseGuards(JwtCookiesAuthGuard)
  @Get(':id')
  getOne(@ParamIdSchema() id: Id, @ReqJwtUser() user: RequestUser) {
    return this.flowRunsService.findOneWithSteps({
      id,
      projectId: user.projectId,
    })
  }

  // TODO tags search
  @UseGuards(JwtCookiesAuthGuard)
  @Get()
  getMany(@QuerySchema(flowRunsGetManyQuerySchema) query: FlowRunsGetManyQuery, @ReqJwtUser() user: RequestUser) {
    return this.flowRunsService.findMany(query, user.projectId)
  }
}
