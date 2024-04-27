import { RequestUser, TestTriggerRequestBody, testTriggerRequestBodySchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { TestTriggerService } from './test-trigger.service'

@Controller('test-trigger')
export class TestTriggerController {
	constructor(private readonly testTriggerService: TestTriggerService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	test(@BodySchema(testTriggerRequestBodySchema) body: TestTriggerRequestBody, @ReqJwtUser() user: RequestUser) {
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
