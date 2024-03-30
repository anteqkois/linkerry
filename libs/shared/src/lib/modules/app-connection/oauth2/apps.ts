import { EncryptedObject } from '../../../common'
import { OAuth2GrantType } from '../api/upsert'
import { OAuth2AuthorizationMethod } from '../oauth2-authorization-method'

export interface OAuth2AppInput {
	clientId: string
	clientSecret: string
	connectorName: string
}

export interface OAuth2AppDecrypted {
	clientId: string
	clientSecret: string
	connectorName: string
}

export interface OAuth2AppEncrypted {
	clientId: string
	clientSecret: EncryptedObject
	connectorName: string
}

export interface OAuth2RedirectQuery {
	state: string
	code: string
	scope: string
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
