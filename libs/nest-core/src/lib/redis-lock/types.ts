import { ModuleMetadata } from '@nestjs/common/interfaces'
import { Redis, RedisOptions } from 'ioredis'

export interface RedisLockModuleOptions extends RedisOptions {
	HOST: string,
	PORT?: number
	PASSWORD?: string
	onClientReady?(client: Redis): void
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (
		...args: any[]
	) => RedisLockModuleOptions | Promise<RedisLockModuleOptions>
	inject?: any[]
}

export interface AcquireLockParams {
	key: string
	timeout: number
}
