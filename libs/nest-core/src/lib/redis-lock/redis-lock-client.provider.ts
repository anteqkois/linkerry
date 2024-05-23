import { Provider } from '@nestjs/common'
import { Redis } from 'ioredis'
import RedLock from 'redlock'

import { REDIS_LOCK_CLIENT, REDIS_LOCK_MODULE_OPTIONS } from './redis-lock.constants'
import { RedisLockModuleOptions, RedisModuleAsyncOptions } from './types'

export class RedisClientError extends Error {}
export interface RedisLockClient {
  redLockClient: RedLock
  redisClient: Redis
}

async function getClient(options: RedisLockModuleOptions): Promise<Redis> {
  const { onClientReady, host: HOST, password: PASSWORD, port: PORT, ...opt } = options

  const client = new Redis({
    host: HOST,
    port: typeof PORT === 'number' ? PORT : 6379,
    password: PASSWORD,
    ...opt,
  })

  if (onClientReady) {
    onClientReady(client)
  }
  return client
}

export const createClient = (): Provider => ({
  provide: REDIS_LOCK_CLIENT,
  useFactory: async (options: RedisLockModuleOptions): Promise<RedisLockClient> => {
    const redisClient = await getClient(options)
    const redLockClient = new RedLock([redisClient], {
      driftFactor: 0.01,
      retryCount: 30,
      retryDelay: 2000,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    })

    return {
      redisClient,
      redLockClient,
    }
  },
  inject: [REDIS_LOCK_MODULE_OPTIONS],
})

export const createAsyncClientOptions = (options: RedisModuleAsyncOptions) => ({
  provide: REDIS_LOCK_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
})
