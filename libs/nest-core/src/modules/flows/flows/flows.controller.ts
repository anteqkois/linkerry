import { FlowGetManyQuery, FlowOperationRequest, Id, RequestUser, flowGetManyQuerySchema, flowOperationRequestSchema } from '@linkerry/shared'
import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { ParamIdSchema } from '../../../lib/nest-utils/decorators/zod/id'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { FlowsService } from './flows.service'

@Controller('flows')
export class FlowsController {
	constructor(private readonly flowsService: FlowsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	getFlow(@ParamIdSchema() id: Id, @ReqJwtUser() user: RequestUser) {
		return this.flowsService.findOne({
			filter: {
				_id: id,
				projectId: user.projectId,
			},
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	getFlows(@QuerySchema(flowGetManyQuerySchema) query: FlowGetManyQuery, @ReqJwtUser() user: RequestUser) {
		return this.flowsService.findMany({
			filter: {
				projectId: user.projectId,
				deleted: false,
			},
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Patch(':id')
	patch(@ParamIdSchema() id: Id, @BodySchema(flowOperationRequestSchema) body: FlowOperationRequest, @ReqJwtUser() user: RequestUser) {
		return this.flowsService.update({
			id,
			projectId: user.projectId,
			userId: user.id,
			operation: body,
		})
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Delete(':id')
	delteFlow(@ParamIdSchema() id: Id, @ReqJwtUser() user: RequestUser) {
		return this.flowsService.deleteOne(id, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	createEmptyFlow(@ReqJwtUser() user: RequestUser) {
		return this.flowsService.createEmpty(user.projectId, user.id)
	}
}
