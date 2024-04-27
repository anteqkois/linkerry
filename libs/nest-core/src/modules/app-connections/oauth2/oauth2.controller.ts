import { OAuth2RedirectQuery } from '@linkerry/shared'
import { Body, Controller, Get, Query, Response, UnprocessableEntityException, UseGuards } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { OAuth2Service } from './oauth2.service'

@Controller('oauth2')
export class Oauth2Controller {
	constructor(private readonly oAuth2Service: OAuth2Service) {}

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
}
