import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { REDIS_CLIENT_NAMESPACE } from '../../configs/redis'
import { FilesModule } from '../../files/files.module'
import { AuthModule } from '../../users/auth'
import { QueuesModule } from '../../workers/flow-worker/queues/queues.module'
import { flowVersionModelFactory } from '../flow-versions/schemas/flow-version.schema'
import { FlowRunWatcherService } from './flow-runs-watcher.service'
import { FlowRunsWebSocketService } from './flow-runs-websocket.gateway'
import { FlowRunsController } from './flow-runs.controller'
import { FlowRunsHooks } from './flow-runs.hooks'
import { FlowRunsService } from './flow-runs.service'
import { FlowRunModelFactory } from './schemas/flow-runs.schema'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([FlowRunModelFactory, flowVersionModelFactory]),
		QueuesModule,
		FilesModule,
		AuthModule,
		// this don't work dou to other namesapce, find way to create two redis instamces with other TOKENS
		// RedisModule.forRootAsync(
		// 	{
		// 		imports: [ConfigModule],
		// 		inject: [ConfigService],
		// 		useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
		// 			return {
		// 				readyLog: true,
		// 				errorLog: true,
		// 				closeClient: true,
		// 				config: [
		// 					{
		// 						namespace: REDIS_CLIENT_NAMESPACE.PUBLISHER,
		// 						host: configService.getOrThrow('REDIS_HOST'),
		// 						port: +configService.get('REDIS_PORT'),
		// 						password: configService.get('REDIS_PASSWORD'),
		// 					},
		// 					{
		// 						namespace: REDIS_CLIENT_NAMESPACE.SUBSCRIBER,
		// 						host: configService.getOrThrow('REDIS_HOST'),
		// 						port: +configService.get('REDIS_PORT'),
		// 						password: configService.get('REDIS_PASSWORD'),
		// 					},
		// 				],
		// 			}
		// 		},
		// 	},
		// 	false,
		// ),
	],
	controllers: [FlowRunsController],
	providers: [FlowRunsService, FlowRunWatcherService, FlowRunsHooks, FlowRunsWebSocketService],
	exports: [FlowRunsService, FlowRunWatcherService],
})
export class FlowRunsModule {}
