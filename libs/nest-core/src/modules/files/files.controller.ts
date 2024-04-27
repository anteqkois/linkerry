import { Id, RequestUser } from '@linkerry/shared';
import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { JwtCookiesAuthGuard } from '../../lib/auth';
import { ParamIdSchema } from '../../lib/nest-utils/decorators/zod/id.decorator';
import { ReqJwtUser } from '../users/auth/decorators/req-jwt-user.decorator';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get(':id')
	@Header('Content-Type', 'application/zip')
	getFlow(@ParamIdSchema() id: Id, @ReqJwtUser() user: RequestUser) {
		return this.filesService.findOne({
			projectId: user.projectId,
			fileId: id,
		})
	}
}
