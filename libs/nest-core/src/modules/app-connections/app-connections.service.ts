import {
	AppConnectionDecrypted,
	AppConnectionEncrypted,
	AppConnectionStatus,
	AppConnectionType,
	AppConnectionValue,
	AppConnectionWithoutSensitiveData,
	CustomError,
	EngineResponseStatus,
	ErrorCode,
	Id,
	UpsertAppConnectionInput,
	assertNotNullOrUndefined,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CryptoService } from '../../lib/crypto'
import { EngineService } from '../engine/engine.service'
import { ConnectorsMetadataService } from '../flows'
import { AppConnectionsDocument, AppConnectionsModel } from './schemas/connections.schema'

@Injectable()
export class AppConnectionsService {
	private readonly logger = new Logger(AppConnectionsService.name)

	constructor(
		@InjectModel(AppConnectionsModel.name) private readonly appConnectionsModel: Model<AppConnectionsDocument>,
		private readonly engineService: EngineService,
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly cryptoService: CryptoService,
	) {
		//
	}

	async find(userId: Id) {
		const appConnections = await this.appConnectionsModel.find({
			user: userId,
		})

		return appConnections.map((appConnection) => this._decryptConnection(appConnection.toObject()))
	}

	async findOne({ name, userId }: { userId: Id; name: string }) {
		return this.appConnectionsModel.findOne({
			user: userId,
			name,
		})
	}

	async upsert(userId: Id, body: UpsertAppConnectionInput) {
		const validatedConnectionValue = await this._validateConnectionValue({
			connection: body,
		})

		const encryptedConnectionValue = this.cryptoService.encryptObject({
			...validatedConnectionValue,
			...body.value,
		})

		await this.appConnectionsModel.findOneAndUpdate(
			{
				user: userId,
				name: body.name,
			},
			{
				...body,
				status: AppConnectionStatus.ACTIVE,
				value: encryptedConnectionValue,
				// projectId,
			},
			{
				upsert: true,
			},
		)

		const updatedConnection = await this.findOne({
			userId,
			name: body.name,
		})

		assertNotNullOrUndefined(updatedConnection, 'updatedConnection')

		return this._decryptConnection(updatedConnection.toObject())
	}

	private async _validateConnectionValue({
		connection,
	}: {
		connection: UpsertAppConnectionInput
		//  projectId: ProjectId;
	}): Promise<AppConnectionValue> {
		switch (connection.value.type as AppConnectionType) {
			// case AppConnectionType.PLATFORM_OAUTH2:
			//     return oauth2Handler[connection.value.type].claim({
			//         projectId,
			//         connectorName: connection.connectorName,
			//         request: {
			//             grantType: OAuth2GrantType.AUTHORIZATION_CODE,
			//             code: connection.value.code,
			//             clientId: connection.value.client_id,
			//             tokenUrl: connection.value.token_url!,
			//             authorizationMethod: connection.value.authorization_method,
			//             codeVerifier: connection.value.code_challenge,
			//             redirectUrl: connection.value.redirect_url,
			//         },
			//     })
			// case AppConnectionType.CLOUD_OAUTH2:
			//     return oauth2Handler[connection.value.type].claim({
			//         projectId,
			//         connectorName: connection.connectorName,
			//         request: {
			//             grantType: OAuth2GrantType.AUTHORIZATION_CODE,
			//             code: connection.value.code,
			//             clientId: connection.value.client_id,
			//             tokenUrl: connection.value.token_url!,
			//             authorizationMethod: connection.value.authorization_method,
			//             codeVerifier: connection.value.code_challenge,
			//         },
			//     })
			// case AppConnectionType.OAUTH2:
			//     return oauth2Handler[connection.value.type].claim({
			//         projectId,
			//         connectorName: connection.connectorName,
			//         request: {
			//             code: connection.value.code,
			//             clientId: connection.value.client_id,
			//             tokenUrl: connection.value.token_url!,
			//             grantType: connection.value.grant_type!,
			//             redirectUrl: connection.value.redirect_url,
			//             clientSecret: connection.value.client_secret,
			//             authorizationMethod: connection.value.authorization_method,
			//             codeVerifier: connection.value.code_challenge,
			//         },
			//     })

			case AppConnectionType.CUSTOM_AUTH:
			case AppConnectionType.BASIC_AUTH:
			case AppConnectionType.SECRET_TEXT:
				await this._engineValidateAuth({
					connectorName: connection.connectorName,
					// projectId,
					auth: connection.value as AppConnectionValue,
				})

				break
			default:
				throw new Error(`Unimplemented auth type ${connection.value.type}`)
		}
		// TODO remove any types
		return connection.value as AppConnectionValue
	}

	private async _engineValidateAuth({
		auth,
		connectorName,
	}: {
		connectorName: string
		//  projectId: ProjectId;
		auth: AppConnectionValue
	}): Promise<void> {
		const connectorMetadata = await this.connectorsMetadataService.findOne(connectorName, {})

		const engineResponse = await this.engineService.executeValidateAuth({
			auth,
			connector: {
				connectorName,
				connectorType: connectorMetadata.connectorType,
				connectorVersion: connectorMetadata.version,
			},
			// 	projectId,
		})

		if (engineResponse.status !== EngineResponseStatus.OK) {
			this.logger.error(`#_engineValidateAuth`, engineResponse)
			throw new CustomError('failed to run validateAuth', ErrorCode.ENGINE_OPERATION_FAILURE, engineResponse)
		}

		const validateAuthResult = engineResponse.result

		if (!validateAuthResult.valid && 'error' in validateAuthResult)
			throw new CustomError(validateAuthResult.error, ErrorCode.INVALID_APP_CONNECTION, validateAuthResult)
	}

	private _decryptConnection(encryptedConnection: AppConnectionEncrypted): AppConnectionDecrypted {
		const value = this.cryptoService.decryptObject<AppConnectionValue>(encryptedConnection.value)
		const connection: AppConnectionDecrypted = {
			...encryptedConnection,
			value,
		}
		return connection
	}

	removeSensitiveData(appConnection: AppConnectionDecrypted): AppConnectionWithoutSensitiveData {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { value: _, ...appConnectionWithoutSensitiveData } = appConnection
		return appConnectionWithoutSensitiveData
	}
}
