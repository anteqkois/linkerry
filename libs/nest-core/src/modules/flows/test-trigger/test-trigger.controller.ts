import { RequestUser, TestTriggerRequestBody } from '@linkerry/shared'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth'
import { TestTriggerService } from './test-trigger.service'

@Controller('test-trigger')
export class TestTriggerController {
	constructor(private readonly testTriggerService: TestTriggerService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Post()
	test(@ReqJwtUser() user: RequestUser, @Body() body: TestTriggerRequestBody) {
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
