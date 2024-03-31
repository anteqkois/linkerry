import { RedisModule } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisConfigService } from '../../../configs/redis-config.service'
import { DedupeService } from './dedupe.service'

@Module({
	imports: [
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useClass: RedisConfigService,
		}),
	],
	providers: [DedupeService],
	exports: [DedupeService],
})
export class DedupeModule {}
