import { RequestUser } from '@linkerry/shared'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../lib/auth/guards/jwt-cookies-auth.guard'
import { ReqJwtUser } from './auth/decorators/req-jwt-user.decorator'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtCookiesAuthGuard)
  @Get()
  getUser(@ReqJwtUser() user: RequestUser) {
    // return this.usersService.findOne()
  }

  // @UseGuards(JwtCookiesAuthGuard)
  // @Get('/live-chat')
  // getLiveChatHash(@ReqJwtUser() user: RequestUser) {
  // 	return this.usersService.getLiveChatUserHash(user.id)
  // }
}
