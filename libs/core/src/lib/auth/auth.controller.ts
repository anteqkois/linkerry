import '@fastify/cookie'
import { IAuthSignUpResponse, IUser } from '@market-connector/types'
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { ReqUser } from './decorators/req-user.decorator'
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

    res.setCookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + expireDateUnix),
    })

    return res.send({ user: userRes, error: undefined })
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqUser() user: IUser, @Res({ passthrough: true }) res: FastifyReply) {
    const { access_token, user: userRes } = await this.authService.login(user)
    const expireDateUnix = +this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_UNIX', 3600)

    res.setCookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + expireDateUnix),
    })

    return res.send({ user: userRes, error: undefined })
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
