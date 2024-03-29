import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CryptoModule } from '../../../lib/crypto'
import { Oauth2Controller } from './oauth2.controller'
import { Oauth2Service } from './oauth2.service'
import { AppsModelFactory } from './schemas/apps.schema'

@Module({
	imports: [MongooseModule.forFeatureAsync([AppsModelFactory]), CryptoModule],
	controllers: [Oauth2Controller],
	providers: [Oauth2Service],
})
export class Oauth2Module {}
