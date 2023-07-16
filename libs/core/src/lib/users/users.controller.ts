import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JWTUser } from '../auth/types';

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
