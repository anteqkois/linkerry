import { RequestUser } from '@linkerry/shared';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtCookiesAuthGuard } from '../../../lib/auth';
import { ReqJwtUser } from '../../users/auth/decorators/req-jwt-user.decorator';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}


	@UseGuards(JwtCookiesAuthGuard)
	@Get()
	currentPlanUsage(@ReqJwtUser() user: RequestUser){
		return this.usageService.currentPlanUsage(user.projectId)
	}
}
