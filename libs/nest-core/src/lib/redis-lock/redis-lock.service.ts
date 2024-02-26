import { Inject, Injectable, Logger } from '@nestjs/common'
import { RedisLockClient } from './redis-lock-client.provider'
import { REDIS_LOCK_CLIENT } from './redis-lock.constants'
import { AcquireLockParams } from './types'

@Injectable()
export class RedisLockService {
	private readonly logger = new Logger(RedisLockService.name)

	constructor(@Inject(REDIS_LOCK_CLIENT) private readonly redisClient: RedisLockClient) {}

	async acquireLock({ key, timeout }: AcquireLockParams) {
		try {
			return await this.redisClient.redLockClient.acquire([key], timeout, {
				retryCount: Math.ceil(timeout / 2000) * 2,
				retryDelay: 2000,
			})
		} catch (e) {
			this.logger.error(e)
			throw e
		}
	}
	// getClient(name?: string): Redis {
	// 	if (!name) {
	// 		name = this.redisClient.defaultKey
	// 	}
	// 	const client = this.redisClient.clients.get(name)

	// 	if (!client) {
	// 		throw new RedisClientError(`client ${name} does not exist`)
	// 	}
	// 	return client
	// }

	// getClients(): Map<string, Redis> {
	// 	return this.redisClient.clients
	// }
}
