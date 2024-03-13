import { Id } from '../../common'
import { ConnectorType, PackageType } from './connector'

export interface ConnectorsMetadataGetManyQuery {
	displayName?: string
	summary?: boolean
}

export interface ConnectorsMetadataGetOneQuery {
	summary?: boolean
	version?: string
}

export interface ConnectorsGetOptionsInput {
	packageType: PackageType
	connectorType: ConnectorType
	connectorVersion: string
	connectorName: string
	propertyName: string
	stepName: string
	flowId: Id
	flowVersionId: Id
	input: any
	searchValue?: string
}

export interface ConnectorsGetOptionsResponse {
	options: { label: string; value: string }[]
	disabled?: boolean
	placeholder?: string
}
