import { EncryptedObject } from '../../../common'
import { ConnectorNameType, ShortStringType } from '../../../common/type-validators'

export interface OAuth2AppInput {
	clientId: ShortStringType
	clientSecret: ShortStringType
	connectorName: ConnectorNameType
}

export interface OAuth2AppDecrypted {
	clientId: ShortStringType
	clientSecret: ShortStringType
	connectorName: ConnectorNameType
}

export interface OAuth2AppEncrypted {
	clientId: ShortStringType
	clientSecret: EncryptedObject
	connectorName: ConnectorNameType
}

export interface OAuth2RedirectQuery {
	state: ShortStringType
	code: ShortStringType
	scope: string
}
