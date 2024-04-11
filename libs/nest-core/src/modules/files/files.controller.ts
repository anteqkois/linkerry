import { Id, RequestUser } from '@linkerry/shared';
import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import { JwtCookiesAuthGuard } from '../../lib/auth';
import { ReqJwtUser } from '../users/auth/decorators/req-jwt-user.decorator';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	@Header('Content-Type', 'application/zip')
	getFlow(@ReqJwtUser() user: RequestUser, @Param('id') id: Id) {
		return this.filesService.findOne({
			projectId: user.projectId,
			fileId: id,
		})
	}
}
