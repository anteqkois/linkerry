import '@fastify/cookie'
import {
  AuthStatus,
  Cookies,
  IAuthLoginResponse,
  IAuthLogoutResponse,
  IAuthSignUpResponse,
  IUser,
} from '@market-connector/types'
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { ReqJwtUser } from './decorators/req-user.decorator'
import { SignUpDto } from './dto/sign-up.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Post('signup')
  async signup(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IAuthSignUpResponse> {
    const { access_token, user: userRes } = await this.authService.signUp(signUpDto)
    const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_UNIX', 3600)

    res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + expireDateUnix),
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
      path: '/',
    })

    return res.send({ user: userRes, error: undefined })
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqJwtUser() user: IUser, @Res({ passthrough: true }) res: FastifyReply): Promise<IAuthLoginResponse> {
    const { access_token, user: userRes } = await this.authService.login(user)
    const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_UNIX', 3600)

    res.setCookie(Cookies.ACCESS_TOKEN, access_token, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + expireDateUnix),
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
      path: '/',
    })

    return res.send({ user: userRes, error: undefined })
  }

  // @UseGuards(JwtAuthGuard)
  @Post('logout')
  // async logut(@ReqJWTUser() user: IUser, @Res({ passthrough: true }) res: FastifyReply): Promise<IAuthLogoutResponse> {
  async logut(@Res({ passthrough: true }) res: FastifyReply): Promise<IAuthLogoutResponse> {
    res.clearCookie(Cookies.ACCESS_TOKEN, {
      path: '/',
    })
    res.setCookie(Cookies.AUTH_STATUS, AuthStatus.UNAUTHENTICATED, {
      path: '/',
    })

    return res.send({ error: undefined })
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('refresh')
  // async login(@ReqUser() user: User, @Res({ passthrough: true }) res: FastifyReply) {
  //   const { access_token, user: userRes } = await this.authService.login(user)
  //   const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_UNIX', 3600)

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
