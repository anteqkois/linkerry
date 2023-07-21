import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReqUser } from '../../lib/auth/decorators/req-user.decorator';
import { JwtAuthGuard } from '../../lib/auth/guards/jwt-auth.guard';
import { JWTUser } from '../../lib/auth/types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Add more secure logic
  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@ReqUser() user: JWTUser) {
    return this.usersService.find()
  }

  // It should be avaible only for admin
  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto)
  // }
}
