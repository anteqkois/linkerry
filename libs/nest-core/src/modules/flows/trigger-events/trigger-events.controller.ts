import { JwtUser } from '@linkerry/shared';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../lib/auth';
import { ReqJwtUser } from '../../../lib/auth/decorators/req-user.decorator';
import { PoolTestDto } from './dto/pool-test.dto';
import { TriggerEventsService } from './trigger-events.service';

@Controller('trigger-events')
export class TriggerEventsController {
  constructor(private readonly triggerEventsService: TriggerEventsService) {}

	@UseGuards(JwtAuthGuard)
  @Post('/test/pool')
  create(@ReqJwtUser() user: JwtUser, @Body() poolTestDto: PoolTestDto) {
    return this.triggerEventsService.performPoolTest(poolTestDto, user.id);
  }
}
