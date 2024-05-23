import { OAuth2AuthorizationMethod } from '@linkerry/connectors-framework'
import {
  AppConnectionType,
  BaseOAuth2ConnectionValue,
  CloudOAuth2ConnectionValue,
  CustomError,
  ErrorCode,
  OAuth2AppDecrypted,
  OAuth2AppEncrypted,
  OAuth2AppInput,
  OAuth2GrantType,
  assertNotNullOrUndefined,
  isEmpty,
  isNil,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import axios, { isAxiosError } from 'axios'
import { FilterQuery, Model } from 'mongoose'
import { CryptoService } from '../../../lib/crypto'
import { oauth2Util } from './oauth2-util'
import { AppsDocument, AppsModel } from './schemas/apps.schema'

@Injectable()
export class OAuth2Service {
  private readonly logger = new Logger(OAuth2Service.name)
  private APPS_SECRET: string

  constructor(
    @InjectModel(AppsModel.name) private readonly appConnectionsModel: Model<AppsDocument>,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {
    this.APPS_SECRET = this.configService.getOrThrow('APPS_SECRET')
    if (isEmpty(this.APPS_SECRET)) throw new CustomError(`APPS_SECRET is empty`, ErrorCode.SYSTEM_ENV_INVALID)
  }

  private _decryptApp(app: OAuth2AppEncrypted): OAuth2AppDecrypted {
    const decryptedClientSecret = this.cryptoService.decryptString({ data: app.clientSecret.data, iv: app.clientSecret.iv }, this.APPS_SECRET)

    return {
      ...app,
      clientSecret: decryptedClientSecret,
    }
  }

  async getMany() {
    const apps = await this.appConnectionsModel.find()
    return apps.map(({ clientId, connectorName }) => ({ clientId, connectorName }))
  }

  async getOne(filter: FilterQuery<OAuth2AppDecrypted>) {
    const app = await this.appConnectionsModel.findOne(filter)
    if (!app) return null

    return {
      clientId: app?.clientId,
      connectorName: app?.connectorName,
    }
  }

  private async _getOneDecrypted(filter: FilterQuery<OAuth2AppDecrypted>) {
    const app = await this.appConnectionsModel.findOne(filter)
    if (!app) return null
    return this._decryptApp(app)
  }

  async create(input: OAuth2AppInput) {
    const encryptedData = this.cryptoService.encryptString(input.clientSecret, this.APPS_SECRET)
    await this.appConnectionsModel.create({
      clientId: input.clientId,
      clientSecret: encryptedData,
      connectorName: input.connectorName,
    })
  }

  async claim({ request, connectorName }: ClaimOAuth2Request): Promise<CloudOAuth2ConnectionValue> {
    const grantType = request.grantType ?? OAuth2GrantType.AUTHORIZATION_CODE
    const redirectUrl = request.redirectUrl ?? `${this.configService.getOrThrow('API_GATEWAY_URL')}/v1/oauth2/redirect`

    try {
      const oAuth2App = await this._getOneDecrypted({
        connectorName,
      })
      assertNotNullOrUndefined(oAuth2App, 'oAuth2App', {
        connectorName,
      })

      const body: Record<string, string> = {
        grant_type: grantType,
      }
      switch (grantType) {
        case OAuth2GrantType.AUTHORIZATION_CODE: {
          body['redirect_uri'] = redirectUrl
          body['code'] = request.code
          break
        }
        case OAuth2GrantType.CLIENT_CREDENTIALS:
          break
      }
      if (request.codeVerifier) {
        body['code_verifier'] = request.codeVerifier
      }
      const headers: Record<string, string> = {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      }
      const authorizationMethod = request.authorizationMethod || OAuth2AuthorizationMethod.BODY
      switch (authorizationMethod) {
        case OAuth2AuthorizationMethod.BODY:
          body['client_id'] = request.clientId
          body['client_secret'] = oAuth2App.clientSecret
          break
        case OAuth2AuthorizationMethod.HEADER:
          headers['authorization'] = `Basic ${Buffer.from(`${request.clientId}:${request.clientSecret}`).toString('base64')}`
          break
        default:
          throw new Error(`Unknown authorization method: ${authorizationMethod}`)
      }
      const response = (
        await axios.post(request.tokenUrl, new URLSearchParams(body), {
          headers,
        })
      ).data

      return {
        type: AppConnectionType.CLOUD_OAUTH2,
        ...oauth2Util.formatOAuth2Response(response),
        token_url: request.tokenUrl,
        client_id: request.clientId,
        grant_type: grantType,
        props: request.props,
        authorization_method: authorizationMethod,
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        throw new CustomError('Can not claim OAuth2 data', ErrorCode.INVALID_CLAIM, {
          clientId: request.clientId,
          tokenUrl: request.tokenUrl,
          redirectUrl,
          axiosError: error.response?.data,
        })
      }

      this.logger.error(error, error?.stack)
      throw new CustomError('Can not claim OAuth2 data', ErrorCode.INVALID_CLAIM, {
        clientId: request.clientId,
        tokenUrl: request.tokenUrl,
        redirectUrl,
      })
    }
  }

  async refresh({ connectionValue, connectorName }: RefreshOAuth2Request<CloudOAuth2ConnectionValue>): Promise<CloudOAuth2ConnectionValue> {
    const appConnection = connectionValue
    if (!oauth2Util.isExpired(appConnection)) {
      return appConnection
    }
    const oAuth2App = await this._getOneDecrypted({
      connectorName,
    })
    assertNotNullOrUndefined(oAuth2App, 'oAuth2App', {
      connectorName,
    })
    const grantType = connectionValue.grant_type ?? OAuth2GrantType.AUTHORIZATION_CODE
    const body: Record<string, string> = {}
    switch (grantType) {
      case OAuth2GrantType.AUTHORIZATION_CODE: {
        body['grant_type'] = 'refresh_token'
        body['refresh_token'] = appConnection.refresh_token
        break
      }
      case OAuth2GrantType.CLIENT_CREDENTIALS: {
        body['grant_type'] = grantType
        break
      }
      default:
        throw new Error(`Unknown grant type: ${grantType}`)
    }

    const headers: Record<string, string> = {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    }
    const authorizationMethod = appConnection.authorization_method || OAuth2AuthorizationMethod.BODY
    switch (authorizationMethod) {
      case OAuth2AuthorizationMethod.BODY:
        body['client_id'] = appConnection.client_id
        body['client_secret'] = oAuth2App.clientSecret
        break
      case OAuth2AuthorizationMethod.HEADER:
        headers['authorization'] = `Basic ${Buffer.from(`${appConnection.client_id}:${oAuth2App.clientSecret}`).toString('base64')}`
        break
      default:
        throw new Error(`Unknown authorization method: ${authorizationMethod}`)
    }
    const response = (
      await axios.post(appConnection.token_url, new URLSearchParams(body), {
        headers,
        timeout: 10000,
      })
    ).data
    const mergedObject = mergeNonNull(appConnection, oauth2Util.formatOAuth2Response({ ...response }))
    return {
      ...mergedObject,
      props: appConnection.props,
    }
  }
}

/**
 * When the refresh token is null or undefined, it indicates that the original connection's refresh token is also null
 * or undefined. Therefore, we only need to merge non-null values to avoid overwriting the original refresh token with a
 *  null or undefined value.
 */
function mergeNonNull(appConnection: CloudOAuth2ConnectionValue, oAuth2Response: BaseOAuth2ConnectionValue): CloudOAuth2ConnectionValue {
  const formattedOAuth2Response: Partial<BaseOAuth2ConnectionValue> = Object.fromEntries(
    Object.entries(oAuth2Response).filter(([, value]) => !isNil(value)),
  )

  return {
    ...appConnection,
    ...formattedOAuth2Response,
  } as CloudOAuth2ConnectionValue
}

export type RefreshOAuth2Request<T extends BaseOAuth2ConnectionValue> = {
  connectorName: string
  projectId: string
  connectionValue: T
}

export type OAuth2RequestBody = {
  props?: Record<string, string>
  code: string
  clientId: string
  tokenUrl: string
  clientSecret?: string
  redirectUrl?: string
  grantType?: OAuth2GrantType
  authorizationMethod?: OAuth2AuthorizationMethod
  codeVerifier?: string
}

export type ClaimOAuth2Request = {
  projectId: string
  connectorName: string
  request: OAuth2RequestBody
}
