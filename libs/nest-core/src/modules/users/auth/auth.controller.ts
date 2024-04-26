import '@fastify/cookie'
import { AuthStatus, Cookies, IAuthLoginResponse, IAuthLogoutResponse, IAuthSignUpInput, IAuthSignUpResponse, RequestUser, User } from '@linkerry/shared'
import { TypedBody, TypedRoute } from '@nestia/core'
import { Controller, Response, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyReply } from 'fastify'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { LocalAuthGuard } from '../../../lib/auth/guards/local-auth.guard'
import { AuthService } from './auth.service'
import { ReqUser } from './decorators/req-user.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

	@TypedRoute.Post('signup')
	async signup(@TypedBody() body: IAuthSignUpInput, @Response({ passthrough: true }) res: FastifyReply): Promise<IAuthSignUpResponse> {
		const { access_token, user: userRes } = await this.authService.signUp(body)
		const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_SSECONDS', 3600)

		res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			expires: new Date(Date.now() + 1000 * expireDateUnix),
		})
		res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
			path: '/',
		})

		return res.send({ user: userRes, error: undefined })
	}

	@UseGuards(LocalAuthGuard)
	@TypedRoute.Post('login')
	async login(@ReqUser() user: User, @Response({ passthrough: true }) res: FastifyReply): Promise<IAuthLoginResponse> {
		const { access_token, user: userRes } = await this.authService.login(user)
		const expireDateUnix = +this.configService.get('JWT_ACCES_TOKEN_EXPIRE_SSECONDS', 3600)

		res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			expires: new Date(Date.now() + 1000 * expireDateUnix),
		})
		res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
			path: '/',
		})

		return res.send({ user: userRes })
	}

	// @UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post('logout')
	async logut(@Response({ passthrough: true }) res: FastifyReply): Promise<IAuthLogoutResponse> {
		res.clearCookie(Cookies.ACCESS_TOKEN, {
			path: '/',
		})
		res.setCookie(Cookies.AUTH_STATUS, AuthStatus.UNAUTHENTICATED, {
			path: '/',
		})

		return res.send({ error: undefined })
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post('email/verify')
	async verifyEmail(@TypedBody() body: { code: string }, @ReqUser() user: RequestUser) {
		return this.authService.verifyEmailCode({ code: body.code, userId: user.id })
	}

	@UseGuards(JwtCookiesAuthGuard)
	@TypedRoute.Post('email/resend')
	async resendCode(@ReqUser() user: RequestUser) {
		return this.authService.resendEmailCode({ userId: user.id })
	}

	// TODO refresh token
	// @UseGuards(LocalAuthGuard)
	// @Post('refresh')
	// async login(@ReqUser() user: User, @Response({ passthrough: true }) res: FastifyReply) {
	//   const { access_token, user: userRes } = await this.authService.login(user)
	//   const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_SSECONDS', 3600)

	//   // @ts-ignore
	//   res.setCookie('access_token', access_token, {
	//     httpOnly: true,
	//     secure: false,
	//     sameSite: 'lax',
	//     expires: new Date(Date.now() + expireDateUnix),
	//   })
	//   return res.send({ user: userRes, status: 'ok' })
	// }
}
