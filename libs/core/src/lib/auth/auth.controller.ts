import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../../modules/users';
import { AuthService } from './auth.service';
import { ReqUser } from './decorators/req-user.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqUser() user: User) {
    return this.authService.login(user);
  }
}
