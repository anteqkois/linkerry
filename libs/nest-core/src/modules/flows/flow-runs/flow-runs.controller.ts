import { FlowRunsGetManyQuery, Id, RequestUser } from '@linkerry/shared'
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowRunsService } from './flow-runs.service'

// TODO don't forget about tags search
@Controller('flow-runs')
export class FlowRunsController {
	constructor(private readonly flowRunsService: FlowRunsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	getOne(@ReqJwtUser() user: RequestUser, @Param('id') id: Id) {
		return this.flowRunsService.findOneWithSteps({
			id,
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	getMany(@ReqJwtUser() user: RequestUser, @Query() query: FlowRunsGetManyQuery) {
		return this.flowRunsService.findMany(query)
	}
}
