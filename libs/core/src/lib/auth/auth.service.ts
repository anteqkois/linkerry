import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, UsersService } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(name);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<UserDocument>) {
    const payload = { username: user.name, sub: user._id };
    const secret = this.configService.get('JWT_SECRET')
    console.log(secret);
    return {
      access_token: this.jwtService.sign(payload, { secret }),
    };
  }
}
