import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService): Promise<MongooseModuleOptions> => {
				const username = configService.get<string>('MONGO_USERNAME')
				const password = configService.get<string>('MONGO_PASSWORD')
				const host = configService.get<string>('MONGO_HOST')
				const port = configService.get<string>('MONGO_PORT')
				const database = configService.get<string>('MONGO_DATABASE')
				const protocol = configService.get<string>('MONGO_PROTOCOL')
				const uri = `${protocol}://${username}:${password}@${host}${port ? ':' + port : ''}${database ? '/' + database : ''}`
				return {
					uri,
					autoIndex: true,
				}
			},
			inject: [ConfigService],
		}),
	],
	exports: [MongooseModule],
})
export class MongodbModule {}
