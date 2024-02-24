import { RequestUser } from '@linkerry/shared';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtCookiesAuthGuard } from '../../../lib/auth';
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator';
import { ActionsService } from './actions.service';
import { RunActionDto } from './dto/run.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

	@UseGuards(JwtCookiesAuthGuard)
  @Post('/run')
  create(@ReqJwtUser() user: RequestUser, @Body() runDto: RunActionDto) {
    return this.actionsService.run(user.projectId, runDto);
  }
}
