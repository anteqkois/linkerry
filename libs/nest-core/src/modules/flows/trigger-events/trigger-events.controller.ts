import { RequestUser } from '@linkerry/shared'
import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator'
import { DeleteDto } from './dto/delete.dto'
import { GetManyDto } from './dto/get-many.dto'
import { PoolTestDto } from './dto/pool-test.dto'
import { TriggerEventsService } from './trigger-events.service'

@Controller('trigger-events')
export class TriggerEventsController {
	constructor(private readonly triggerEventsService: TriggerEventsService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get('')
	getTriggerEvents(@ReqJwtUser() user: RequestUser, @Query() query: GetManyDto) {
		return this.triggerEventsService.getMany(query, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Delete('')
	deleteTriggerEvents(@ReqJwtUser() user: RequestUser, @Body() body: DeleteDto) {
		return this.triggerEventsService.deleteMany(body, user.projectId)
	}

	@UseGuards(JwtCookiesAuthGuard)
	@Post('/test/pool')
	create(@ReqJwtUser() user: RequestUser, @Body() poolTestDto: PoolTestDto) {
		return this.triggerEventsService.performPoolTest(poolTestDto, user.projectId)
	}
}
