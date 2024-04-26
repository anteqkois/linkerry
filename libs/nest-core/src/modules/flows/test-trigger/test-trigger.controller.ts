import { RequestUser, TestTriggerRequestBody } from '@linkerry/shared'
import { TypedBody, TypedRoute } from '@nestia/core'
import { Controller, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { TestTriggerService } from './test-trigger.service'

@Controller('test-trigger')
export class TestTriggerController {
	constructor(private readonly testTriggerService: TestTriggerService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post()
	test(@ReqJwtUser() user: RequestUser, @TypedBody() body: TestTriggerRequestBody) {
		this.testTriggerService.test({
			flowId: body.flowId,
			flowVersionId: body.flowVersionId,
			testStrategy: body.testStrategy,
			triggerName: body.triggerName,
			projectId: user.projectId,
			userId: user.id,
		})
	}
}
