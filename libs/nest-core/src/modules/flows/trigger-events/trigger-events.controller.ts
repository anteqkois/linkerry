import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TriggerEventsService } from './trigger-events.service';
import { JwtAuthGuard } from '../../../lib/auth';
import { ReqJwtUser } from '../../../lib/auth/decorators/req-user.decorator';
import { JwtUser } from '@market-connector/shared';
import { PoolTestDto } from './dto/pool-test.dto';

@Controller('trigger-events')
export class TriggerEventsController {
  constructor(private readonly triggerEventsService: TriggerEventsService) {}

	@UseGuards(JwtAuthGuard)
  @Post('/test/pool')
  create(@ReqJwtUser() user: JwtUser, @Body() poolTestDto: PoolTestDto) {
    return this.triggerEventsService.performPoolTest(poolTestDto, user.id);
  }
}
