import '@fastify/cookie'
import {
  AuthStatus,
  Cookies,
  IAuthLoginResponse,
  IAuthLogoutResponse,
  RequestUser,
  SignUpInput,
  SignUpResponse,
  User,
  VerifyEmailInput,
  signUpInputSchema,
  verifyEmailInputSchema,
} from '@linkerry/shared'
import { Controller, Post, Response, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyReply } from 'fastify'
import { JwtCookiesAuthGuard } from '../../../lib/auth'
import { LocalAuthGuard } from '../../../lib/auth/guards/local-auth.guard'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { AuthService } from './auth.service'
import { ReqUser } from './decorators/req-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post('signup')
  async signup(@BodySchema(signUpInputSchema) body: SignUpInput, @Response({ passthrough: true }) res: FastifyReply): Promise<SignUpResponse> {
    const { access_token, user: userRes } = await this.authService.signUp(body)
    const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_SSECONDS', 3600)
    const domain = this.configService.getOrThrow('DOMAIN')

    res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: false,
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

    const { access_token, user: userRes } = await this.authService.login(user)
    const expireDateUnix = +this.configService.get('JWT_ACCES_TOKEN_EXPIRE_SSECONDS', 3600)
    const domain = this.configService.getOrThrow('DOMAIN')

    res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
      path: '/',
      domain,
      httpOnly: true,
      secure: false,
      // sameSite: 'lax',
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * expireDateUnix),
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
      domain,
      path: '/',
    })

    return res.send({ user: userRes })
  }

  // @UseGuards(JwtCookiesAuthGuard)
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

  // @UseGuards(LocalAuthGuard)
  // @Post('refresh')
  // async login(@ReqUser() user: User, @Response({ passthrough: true }) res: FastifyReply) {
  //   const { access_token, user: userRes } = await this.authService.login(user)
  //   const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_SSECONDS', 3600)

  //   res.setCookie('access_token', access_token, {
  //     httpOnly: true,
  //     secure: false,
      // sameSite: 'lax',
  //     none: 'lax',
  //     expires: new Date(Date.now() + expireDateUnix),
  //   })
  //   return res.send({ user: userRes, status: 'ok' })
  // }
}
