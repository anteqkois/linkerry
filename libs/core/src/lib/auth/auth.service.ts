import { Injectable } from '@nestjs/common';
import { Customer, CustomerDocument, CustomersService } from '../customers';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private customersService: CustomersService,
    private jwtService: JwtService
  ) { }

  async validateCustomer(name: string, pass: string): Promise<any> {
    const customer = await this.customersService.findOne(name);
    if (customer && customer.password === pass) {
      const { password, ...result } = customer;
      return result;
    }
    return null;
  }

  async login(user: Partial<CustomerDocument>) {
    const payload = { username: user.name, sub: user._id };
    const secret = this.configService.get('JWT_SECRET')
    console.log(secret);
    return {
      access_token: this.jwtService.sign(payload, { secret }),
    };
  }
}
