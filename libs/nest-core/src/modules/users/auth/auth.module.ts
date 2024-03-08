import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { HashService } from '../../../lib/auth/hash.service'
import { JWTService } from '../../../lib/auth/jwt.service'
import { JwtBearerTokenStrategy } from '../../../lib/auth/strategies/jwt-bearer-token.strategy'
import { JwtCookiesStrategy } from '../../../lib/auth/strategies/jwt-cookies.strategy'
import { LocalStrategy } from '../../../lib/auth/strategies/local.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ProjectsModule } from '../../projects/projects.module'
import { UsersModule } from '../users.module'
import { UserModel, UserSchema } from '../schemas/user.schema'
import { UsersService } from '../users.service'

@Module({
	imports: [
		UsersModule,
		PassportModule,
		ConfigModule,
		ProjectsModule,
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
		MongooseModule.forFeatureAsync([
			{
				name: UserModel.name,
				useFactory: () => {
					const schema = UserSchema
					schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }) // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
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
		JwtBearerTokenStrategy,
		UsersService,
		JwtService,
		HashService,
		ConfigService,
		JWTService,
	],
	exports: [AuthService],
})
export class AuthModule {}
