import { RedisModuleOptions, RedisOptionsFactory } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { REDIS_CLIENT_NAMESPACE } from './redis'

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      readyLog: true,
      errorLog: true,
      closeClient: true,
      config: {
        namespace: REDIS_CLIENT_NAMESPACE.SERVER,
        host: this.configService.getOrThrow('REDIS_HOST'),
        port: +this.configService.get('REDIS_PORT'),
        password: this.configService.get('REDIS_PASSWORD'),
      },
      // config: [
      // 	{
      // 		namespace: REDIS_CLIENT_NAMESPACE.SERVER,
      // 		host: this.configService.getOrThrow('REDIS_HOST'),
      // 		port: +this.configService.get('REDIS_PORT'),
      // 		password: this.configService.get('REDIS_PASSWORD'),
      // 	},
      // ],
    }
  }
}
