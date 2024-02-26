import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { MongodbModule } from './lib/mongodb'
import { RedisLockModule } from './lib/redis-lock'
import { AllExceptionsFilter, RequestLoggerMiddleware } from './lib/utils'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongodbModule,
		RedisLockModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				HOST: configService.getOrThrow('REDIS_HOST'),
				PORT: +configService.get('REDIS_PORT'),
				PASSWORD: configService.get('REDIS_PASSWORD'),
				onClientReady: (client) => {
					client.on('error', (err: any) => {
						console.error(err)
					})
				},
			}),
			inject: [ConfigService],
		}),
		// SandboxModule,
		// EngineModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		// To register as a global guard
		// {
		//   provide: APP_GUARD,
		//   useClass: JwtCookiesAuthGuard,
		// },
	],
	exports: [],
})
export class CoreModule {
	// Add a middleware on all routes
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestLoggerMiddleware).forRoutes('*')
	}
}
