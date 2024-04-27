import { OAuth2AppInput, oAuth2AppInputSchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body'
import { OAuth2Service } from './oauth2.service'

@Controller('admin/oauth2')
export class Oauth2AdminController {
	constructor(private readonly oAuth2Service: OAuth2Service) {}

	@UseGuards(AdminGuard)
	@Post()
	async create(@BodySchema(oAuth2AppInputSchema) body: OAuth2AppInput) {
		await this.oAuth2Service.create(body)
	}
}
