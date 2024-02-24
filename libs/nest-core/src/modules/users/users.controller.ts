import { RequestUser } from '@linkerry/shared';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator';
import { JwtCookiesAuthGuard } from '../../lib/auth/guards/jwt-cookies-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Add more secure logic
  @UseGuards(JwtCookiesAuthGuard)
  @Get()
  getUser(@ReqJwtUser() user: RequestUser) {
    return this.usersService.find()
  }

  // It should be avaible only for admin
  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto)
  // }
}
