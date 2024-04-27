import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CryptoModule } from '../../../lib/crypto'
import { Oauth2AdminController } from './oauth2.-admin.controller'
import { Oauth2Controller } from './oauth2.controller'
import { OAuth2Service } from './oauth2.service'
import { AppsModelFactory } from './schemas/apps.schema'

@Module({
	imports: [MongooseModule.forFeatureAsync([AppsModelFactory]), CryptoModule],
	controllers: [Oauth2Controller, Oauth2AdminController],
	providers: [OAuth2Service],
	exports: [OAuth2Service],
})
export class Oauth2Module {}
