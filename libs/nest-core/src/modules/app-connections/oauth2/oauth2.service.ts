import { ClaimOAuth2Request, OAuth2AppDecrypted, OAuth2AppEncrypted, OAuth2AppInput, OAuth2RedirectQuery } from '@linkerry/shared'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CryptoService } from '../../../lib/crypto'
import { AppsDocument, AppsModel } from './schemas/apps.schema'

@Injectable()
export class Oauth2Service {
	constructor(
		@InjectModel(AppsModel.name) private readonly appConnectionsModel: Model<AppsDocument>,
		private readonly cryptoService: CryptoService,
		private readonly configService: ConfigService,
	) {}

	private _decryptApp(app: OAuth2AppEncrypted): OAuth2AppDecrypted {
		const decryptedClientSecret = this.cryptoService.decryptString(
			{ data: app.clientSecret.data, iv: app.clientSecret.iv },
			this.configService.getOrThrow('APPS_SECRET'),
		)

		return {
			...app,
			clientSecret: decryptedClientSecret,
		}
	}

	async getMany() {
		const apps = await this.appConnectionsModel.find()
		return apps.map(({ clientId, connectorName }) => ({ clientId, connectorName }))
	}

	async create(input: OAuth2AppInput) {
		const encryptedData = this.cryptoService.encryptString(input.clientSecret, this.configService.getOrThrow('APPS_SECRET'))
		await this.appConnectionsModel.create({
			clientId: input.clientId,
			clientSecret: encryptedData,
			connectorName: input.connectorName,
		})
	}

		// console.dir(query, { depth: null })
		// const { code, scope, state } = query

		// const OAuth2App  = this.appConnectionsModel.find()

		// this._claim({
		// 	connectorName: '',
		// 	projectId: '',
		// 	request: {
		// 		clientId
		// 	}
		// })

	// private async _claim({connectorName, projectId, request}: ClaimOAuth2Request){

	// }
	// private async _getOAuthTokens(){}
}
