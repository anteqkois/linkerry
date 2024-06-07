import '@fastify/cookie'
import {
  AuthStatus,
  Cookies,
  CustomError,
  ErrorCode,
  IAuthLoginResponse,
  IAuthLogoutResponse,
  RequestUser,
  SignUpInput,
  SignUpResponse,
  User,
  VerifyEmailInput,
  signUpInputSchema,
  verifyEmailInputSchema
} from '@linkerry/shared'
import { Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { LocalAuthGuard } from '../../../lib/auth/guards/local-auth.guard'
import { JWTCustomService } from '../../../lib/auth/jwt-custom.service'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { AuthService } from './auth.service'
import { ReqUser } from './decorators/req-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtCustomService: JWTCustomService,
  ) {}

  @Post('signup')
  async signup(@BodySchema(signUpInputSchema) body: SignUpInput, @Response({ passthrough: true }) res: FastifyReply): Promise<SignUpResponse> {
    const { access_token, user: userRes } = await this.authService.signUp(body)
    const expireDateUnix = +this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRE_SSECONDS', 3600)
    const domain = this.configService.getOrThrow('DOMAIN')

    res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: true,
      // sameSite: 'lax',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * expireDateUnix),
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
      domain,
      path: '/',
    })

    return res.send({ user: userRes, error: undefined })
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    // it is required for passportJS to add id
    @ReqUser() user: User & { id?: number },
    @Response({ passthrough: true }) res: FastifyReply,
  ): Promise<IAuthLoginResponse> {
    delete user.id

    const { access_token, refresh_token, user: userRes } = await this.authService.login(user)
    const domain = this.configService.getOrThrow('DOMAIN')

    res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: true,
      // sameSite: 'lax',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * this.jwtCustomService.JWT_ACCESS_TOKEN_EXPIRE_SSECONDS),
    })
    res.setCookie(Cookies.REFRESH_TOKEN, refresh_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: true,
      // sameSite: 'lax',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * this.jwtCustomService.JWT_REFRESH_TOKEN_EXPIRE_SSECONDS),
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
      domain,
      path: '/',
    })

    return res.send({ user: userRes })
  }

  @Post('logout')
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
  @Post('email/verify')
  async verifyEmail(@BodySchema(verifyEmailInputSchema) body: VerifyEmailInput, @ReqUser() user: RequestUser) {
    return this.authService.verifyEmailCode({
      code: body.code,
      userId: user.id,
    })
  }

  @UseGuards(JwtCookiesAuthGuard)
  @Post('email/resend')
  async resendCode(@ReqUser() user: RequestUser) {
    return this.authService.resendEmailCode({ userId: user.id })
  }

  @Get('refresh')
  async refresh(@Request() req: FastifyRequest, @Response({ passthrough: true }) res: FastifyReply) {
    const refreshToken = req.cookies[Cookies.REFRESH_TOKEN]
    if (!refreshToken) throw new CustomError(`Can not retrive refresh token`, ErrorCode.INVALID_OR_EXPIRED_JWT_TOKEN)

    const domain = this.configService.getOrThrow('DOMAIN')
    const response = await this.authService.refreshToken(refreshToken, req.id)
    if (response.alreadyRefreshed) return res.send({ success: true })

    res.setCookie(Cookies.ACCESS_TOKEN, response.access_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: true,
      // sameSite: 'lax',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * this.jwtCustomService.JWT_ACCESS_TOKEN_EXPIRE_SSECONDS),
    })
    res.setCookie(Cookies.REFRESH_TOKEN, response.refresh_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: true,
      // sameSite: 'lax',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * this.jwtCustomService.JWT_REFRESH_TOKEN_EXPIRE_SSECONDS),
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
      domain,
      path: '/',
    })

    return res.send({ success: true })
  }
}
