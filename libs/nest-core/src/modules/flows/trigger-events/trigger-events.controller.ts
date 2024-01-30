import { RequestUser } from '@linkerry/shared';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../lib/auth';
import { ReqJwtUser } from '../../../lib/auth/decorators/req-user.decorator';
import { GetManyDto } from './dto/get-many.dto';
import { PoolTestDto } from './dto/pool-test.dto';
import { TriggerEventsService } from './trigger-events.service';

@Controller('trigger-events')
export class TriggerEventsController {
  constructor(private readonly triggerEventsService: TriggerEventsService) {}

	@UseGuards(JwtAuthGuard)
  @Get('')
  getTriggerEvents(@ReqJwtUser() user: RequestUser, @Query() query: GetManyDto) {
    return this.triggerEventsService.getMany(query, user.id);
  }

	@UseGuards(JwtAuthGuard)
  @Post('/test/pool')
  create(@ReqJwtUser() user: RequestUser, @Body() poolTestDto: PoolTestDto) {
    return this.triggerEventsService.performPoolTest(poolTestDto, user.id);
  }
}
