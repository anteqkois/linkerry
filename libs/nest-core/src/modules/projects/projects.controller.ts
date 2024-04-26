import { RequestUser } from '@linkerry/shared';
import { TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtCookiesAuthGuard } from '../../lib/auth';
import { ReqJwtUser } from '../users/auth/decorators/req-jwt-user.decorator';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}


	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Get()
	async findManyUserProject(@ReqJwtUser() user: RequestUser) {
		return this.projectsService.findManyUserProjects(user.id)
	}
}
