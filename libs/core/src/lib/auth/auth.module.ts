import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Customer, CustomerSchema, CustomersModule, CustomersService } from '../customers';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [CustomersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeatureAsync([{
      name: Customer.name,
      useFactory: () => {
        const schema = CustomerSchema;
        schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
        return schema;
      },
    },])],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, CustomersService, JwtService]
})
export class AuthModule { }
