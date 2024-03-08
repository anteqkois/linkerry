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
	isNil,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CryptoService } from '../../lib/crypto'
import { RedisLockService } from '../../lib/redis-lock'
import { EngineService } from '../engine/engine.service'
import { ConnectorsMetadataService } from '../flows/connectors/connectors-metadata/connectors-metadata.service'
import { oauth2Util } from './oauth2'
import { AppConnectionsModel } from './schemas/connections.schema'

@Injectable()
export class AppConnectionsService {
	private readonly logger = new Logger(AppConnectionsService.name)

	constructor(
		@InjectModel(AppConnectionsModel.name) private readonly appConnectionsModel: Model<AppConnectionsModel>,
		private readonly engineService: EngineService,
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly cryptoService: CryptoService,
		private readonly redisLockService: RedisLockService,
	) {
		//
	}

	async _refresh(connection: AppConnectionDecrypted): Promise<AppConnectionDecrypted> {
		// /Users/anteqkois/Code/Projects/me/activepieces/packages/backend/src/app/app-connection/app-connection-service/app-connection-service.ts
		// switch (connection.value.type) {
		// 	case AppConnectionType.PLATFORM_OAUTH2:
		// 		connection.value = await oauth2Handler[connection.value.type].refresh({
		// 			pieceName: connection.pieceName,
		// 			projectId: connection.projectId,
		// 			connectionValue: connection.value,
		// 		})
		// 		break
		// 	case AppConnectionType.CLOUD_OAUTH2:
		// 		connection.value = await oauth2Handler[connection.value.type].refresh({
		// 			pieceName: connection.pieceName,
		// 			projectId: connection.projectId,
		// 			connectionValue: connection.value,
		// 		})
		// 		break
		// 	case AppConnectionType.OAUTH2:
		// 		connection.value = await oauth2Handler[connection.value.type].refresh({
		// 			pieceName: connection.pieceName,
		// 			projectId: connection.projectId,
		// 			connectionValue: connection.value,
		// 		})
		// 		break
		// 	default:
		// 		break
		// }
		return connection
	}

	/**
	 * We should make sure this is accessed only once, as a race condition could occur where the token needs to be
	 * refreshed and it gets accessed at the same time, which could result in the wrong request saving incorrect data.
	 */
	async _lockAndRefreshConnection({ projectId, name }: { projectId: Id; name: string }) {
		const refreshLock = await this.redisLockService.acquireLock({
			key: `${projectId}_${name}`,
			timeout: 20000,
		})

		let appConnectionDecrypted: AppConnectionDecrypted | null = null

		try {
			const encryptedAppConnection = await this.findOne({
				projectId,
				name,
			})
			if (isNil(encryptedAppConnection)) {
				return encryptedAppConnection
			}
			appConnectionDecrypted = this._decryptConnection(encryptedAppConnection)
			if (!this._needRefresh(appConnectionDecrypted)) {
				return appConnectionDecrypted
			}
			const refreshedAppConnection = await this._refresh(appConnectionDecrypted)

			await this.appConnectionsModel.updateOne(
				{
					_id: appConnectionDecrypted._id,
				},
				{
					status: AppConnectionStatus.ACTIVE,
					value: this.cryptoService.encryptObject(refreshedAppConnection.value),
				},
			)
			return refreshedAppConnection
		} catch (err) {
			this.logger.error(err)
			if (!isNil(appConnectionDecrypted)) {
				appConnectionDecrypted.status = AppConnectionStatus.ERROR
				await this.appConnectionsModel.updateOne(
					{
						_id: appConnectionDecrypted._id,
					},
					{
						status: appConnectionDecrypted.status,
					},
				)
			}
		} finally {
			await refreshLock.release()
		}
		return appConnectionDecrypted
	}

	_needRefresh(connection: AppConnectionDecrypted): boolean {
		switch (connection.value.type) {
			case AppConnectionType.PLATFORM_OAUTH2:
			case AppConnectionType.CLOUD_OAUTH2:
			case AppConnectionType.OAUTH2:
				return oauth2Util.isExpired(connection.value)
			default:
				return false
		}
	}

	async find(projectId: Id) {
		const appConnections = await this.appConnectionsModel.find({
			projectId,
		})

		return appConnections.map((appConnection) => this._decryptConnection(appConnection.toObject()))
	}

	async findOne({ name, projectId }: { projectId: Id; name: string }) {
		return (await this.appConnectionsModel.findOne({
			projectId,
			name,
		}))?.toObject()
	}

	async getOne({ name, projectId }: { projectId: Id; name: string }) {
		const encryptedConnection =( await this.findOne({
			name,
			projectId,
		}))

		if (isNil(encryptedConnection)) return null

		const decryptedConnection = this._decryptConnection(encryptedConnection)

		if (!this._needRefresh(decryptedConnection)) {
			return decryptedConnection
		}

		return this._lockAndRefreshConnection({ projectId, name })
	}

	async upsert(projectId: Id, body: UpsertAppConnectionInput) {
		const validatedConnectionValue = await this._validateConnectionValue({
			connection: body,
			projectId,
		})

		const encryptedConnectionValue = this.cryptoService.encryptObject({
			...validatedConnectionValue,
			...body.value,
		})

		await this.appConnectionsModel.findOneAndUpdate(
			{
				projectId,
				name: body.name,
			},
			{
				...body,
				status: AppConnectionStatus.ACTIVE,
				value: encryptedConnectionValue,
				projectId,
			},
			{
				upsert: true,
			},
		)

		const updatedConnection = await this.findOne({
			projectId,
			name: body.name,
		})

		assertNotNullOrUndefined(updatedConnection, 'updatedConnection')

		return this._decryptConnection(updatedConnection)
	}

	private async _validateConnectionValue({
		connection,
		projectId,
	}: {
		connection: UpsertAppConnectionInput
		projectId: Id
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
					projectId,
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
		projectId,
	}: {
		connectorName: string
		projectId: Id
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
			projectId,
		})

		if (engineResponse.status !== EngineResponseStatus.OK) {
			this.logger.error(`#_engineValidateAuth`, engineResponse)
			throw new CustomError('failed to run validateAuth', ErrorCode.ENGINE_OPERATION_FAILURE, engineResponse)
		}

		const validateAuthResult = engineResponse.result

		console.log('validateAuthResult', validateAuthResult)
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
