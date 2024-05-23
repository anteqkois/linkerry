/*
Create based on https://github.com/skunight/nestjs-redis/tree/master
*/
import { DynamicModule, Module } from '@nestjs/common'
import { RedisLockModuleOptions, RedisModuleAsyncOptions } from './types'

import { RedisLockCoreModule } from './redis-lock-core.module'

@Module({})
export class RedisLockModule {
  static register(options: RedisLockModuleOptions): DynamicModule {
    return {
      module: RedisLockModule,
      imports: [RedisLockCoreModule.register(options)],
    }
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisLockModule,
      imports: [RedisLockCoreModule.forRootAsync(options)],
    }
  }
}
