import { ModuleMetadata } from '@nestjs/common/interfaces'
import { Redis, RedisOptions } from 'ioredis'

export interface RedisLockModuleOptions extends RedisOptions {
	host: string,
	port?: number
	password?: string
	onClientReady?(client: Redis): void
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (
		...args: any[]
	) => RedisLockModuleOptions | Promise<RedisLockModuleOptions>
	inject?: any[]
}

export type ApLock = {
	release(): Promise<unknown>
}

export interface AcquireLockParams {
	key: string
	timeoutMs: number
}
