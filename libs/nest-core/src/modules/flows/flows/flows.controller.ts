import { FlowGetManyQuery, FlowOperationRequest, Id, RequestUser } from '@linkerry/shared'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowsService } from './flows.service'

@Controller('flows')
export class FlowsController {
	constructor(private readonly flowsService: FlowsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get(':id')
	getFlow(@ReqJwtUser() user: RequestUser, @TypedParam('id') id: Id) {
		return this.flowsService.findOne({
			filter: {
				_id: id,
				projectId: user.projectId,
			},
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	getFlows(@ReqJwtUser() user: RequestUser, @TypedQuery() query: FlowGetManyQuery) {
		return this.flowsService.findMany({
			filter: {
				projectId: user.projectId,
				deleted: false,
			},
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Patch(':id')
	patch(@ReqJwtUser() user: RequestUser, @TypedParam('id') id: Id, @TypedBody() body: FlowOperationRequest) {
		return this.flowsService.update({
			id,
			projectId: user.projectId,
			userId: user.id,
			operation: body,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Delete(':id')
	delteFlow(@ReqJwtUser() user: RequestUser, @TypedParam('id') id: Id) {
		return this.flowsService.deleteOne(id, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post()
	createEmptyFlow(@ReqJwtUser() user: RequestUser) {
		return this.flowsService.createEmpty(user.projectId, user.id)
	}
}
