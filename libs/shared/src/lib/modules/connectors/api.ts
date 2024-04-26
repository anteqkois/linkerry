import { Id } from '../../common'
import { ConnectorNameType, ShortStringType, VersionType } from '../../common/type-validators'
import { ConnectorType, PackageType } from './connector'

export interface ConnectorsMetadataGetManyQuery {
	displayName?: ShortStringType
	summary?: boolean
}

export interface ConnectorsMetadataGetOneQuery {
	summary?: boolean
	version?: VersionType
}

export interface ConnectorsGetOptionsInput {
	packageType: PackageType
	connectorType: ConnectorType
	connectorVersion: VersionType
	connectorName: ConnectorNameType
	propertyName: ShortStringType
	stepName: ShortStringType
	flowId: Id
	flowVersionId: Id
	input: any
	searchValue?: ShortStringType
}

export interface ConnectorsGetOptionsResponse {
	options: { label: string; value: string }[]
	disabled?: boolean
	placeholder?: string
}
