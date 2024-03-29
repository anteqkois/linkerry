import { OAuth2AppInput } from '@linkerry/shared'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { AdminGuard } from '../../../lib/auth/guards/admin.guard'
import { Oauth2Service } from './oauth2.service'

@Controller('oauth2')
export class Oauth2Controller {
	constructor(private readonly oAuth2Service: Oauth2Service) {}

	@UseGuards(JwtCookiesAuthGuard)
	@Get('apps')
	getMany() {
		return this.oAuth2Service.getMany()
	}

	@Get('redirect')
	redirect(@Body() body: any, @Query() query: any) {
		return this.oAuth2Service.redirect(body, query)
		//
	}

	@UseGuards(AdminGuard)
	@Post()
	async create(@Body() body: OAuth2AppInput) {
		await this.oAuth2Service.create(body)
	}
}
