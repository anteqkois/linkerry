import { RedisModule } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { HashService } from '../../../lib/auth/hash.service'
import { JWTCustomService } from '../../../lib/auth/jwt-custom.service'
import { JwtBearerTokenStrategy } from '../../../lib/auth/strategies/jwt-bearer-token.strategy'
import { JwtCookiesStrategy } from '../../../lib/auth/strategies/jwt-cookies.strategy'
import { JwtWebsocketStrategy } from '../../../lib/auth/strategies/jwt-websocket.strategy'
import { LocalStrategy } from '../../../lib/auth/strategies/local.strategy'
import { RedisLockModule } from '../../../lib/redis-lock'
import { SubscriptionsModule } from '../../billing/subscriptions/subscriptions.module'
import { RedisConfigService } from '../../configs/redis-config.service'
import { EmailModule } from '../../notifications/email/email.module'
import { ProjectsModule } from '../../projects/projects.module'
import { UserModel, UserSchema } from '../schemas/user.schema'
import { UsersModule } from '../users.module'
import { UsersService } from '../users.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    ProjectsModule,
    SubscriptionsModule,
    EmailModule,
    ConfigModule,
    RedisLockModule,
    // TODO refactor this to global module
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: RedisConfigService,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          // signOptions: { expiresIn: '60s' },
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeatureAsync([
      {
        name: UserModel.name,
        useFactory: () => {
          const schema = UserSchema
          schema.plugin(mongooseUniqueValidator, { message: 'Email or nick exists' }) // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
          return schema
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtCookiesStrategy,
    JwtWebsocketStrategy,
    JwtBearerTokenStrategy,
    UsersService,
    HashService,
    ConfigService,
    JWTCustomService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
