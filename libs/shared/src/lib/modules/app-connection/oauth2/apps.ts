import { EncryptedObject } from '../../../common'

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
