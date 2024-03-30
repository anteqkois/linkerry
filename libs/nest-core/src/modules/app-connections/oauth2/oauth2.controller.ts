import { OAuth2AppInput, OAuth2RedirectQuery } from '@linkerry/shared'
import { Body, Controller, Get, Post, Query, Response, UnprocessableEntityException, UseGuards } from '@nestjs/common'
import { FastifyReply } from 'fastify'
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

	// TODO add DTO parser to prevent unecessary data
	@Get('redirect')
	redirect(@Body() body: any, @Query() query: OAuth2RedirectQuery, @Response() response: FastifyReply) {
		const params = {
			code: query.code,
		}
		if (!params.code) throw new UnprocessableEntityException('The code is missing in url')
		return response
			.type('text/html')
			.send(
				`<script>if(window.opener){window.opener.postMessage({ 'code': '${encodeURIComponent(
					params.code,
				)}' },'*')}</script> <html>Redirect succuesfully, this window should close now</html>`,
			)
	}

	@UseGuards(AdminGuard)
	@Post()
	async create(@Body() body: OAuth2AppInput) {
		await this.oAuth2Service.create(body)
	}
}
