import { FlowRunsGetManyQuery, Id, RequestUser } from '@linkerry/shared'
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowRunsService } from './flow-runs.service'

// TODO add tags search
@Controller('flow-runs')
export class FlowRunsController {
	constructor(private readonly flowRunsService: FlowRunsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get(':id')
	getOne(@ReqJwtUser() user: RequestUser, @TypedParam('id') id: Id) {
		return this.flowRunsService.findOneWithSteps({
			id,
			projectId: user.projectId,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	getMany(@ReqJwtUser() user: RequestUser, @TypedQuery() query: FlowRunsGetManyQuery) {
		return this.flowRunsService.findMany(query, user.projectId)
	}
}
