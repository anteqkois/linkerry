/*
Create based on https://github.com/skunight/nestjs-redis/tree/master
*/
import { DynamicModule, Global, Inject, Module, OnModuleDestroy } from '@nestjs/common'
import { RedisLockClient, createAsyncClientOptions, createClient } from './redis-lock-client.provider'
import { RedisLockModuleOptions, RedisModuleAsyncOptions } from './types'

import { REDIS_LOCK_CLIENT, REDIS_LOCK_MODULE_OPTIONS } from './redis-lock.constants'
import { RedisLockService } from './redis-lock.service'

@Global()
@Module({
	providers: [RedisLockService],
	exports: [RedisLockService],
})
export class RedisLockModule implements OnModuleDestroy {
	constructor(
		@Inject(REDIS_LOCK_MODULE_OPTIONS)
		private readonly options: RedisLockModuleOptions,
		@Inject(REDIS_LOCK_CLIENT)
		private readonly redisLockClient: RedisLockClient,
	) {}

	static register(options: RedisLockModuleOptions): DynamicModule {
		return {
			module: RedisLockModule,
			providers: [createClient(), { provide: REDIS_LOCK_MODULE_OPTIONS, useValue: options }],
			exports: [RedisLockService],
		}
	}

	static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
		return {
			module: RedisLockModule,
			imports: options.imports,
			providers: [createClient(), createAsyncClientOptions(options)],
			exports: [RedisLockService],
		}
	}

	onModuleDestroy() {
		const closeConnection =
			({ redLockClient, redisClient }: RedisLockClient) =>
			(options: RedisLockModuleOptions) => {
				redisClient.disconnect()
			}

		const closeClientConnection = closeConnection(this.redisLockClient)

		closeClientConnection(this.options)
	}
}
