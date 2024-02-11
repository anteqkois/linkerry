import { Id } from '../../common'
import { ConnectorType } from './connector'

export interface ConnectorsMetadataGetManyQuery {
	displayName?: string
	summary?: boolean
}

export interface ConnectorsMetadataGetOneQuery {
	summary?: boolean
	version?: string
}

export interface ConnectorsGetOptionsInput {
	// packageType: 'REGISTRY'
	connectorType: ConnectorType
	connectorVersion: string
	connectorName: string
	propertyName: string
	stepName: string
	flowId: Id
	flowVersionId: Id
	input: any
}

export interface ConnectorsGetOptionsResponse {
	options: { label: string; value: number }[]
	disabled?: boolean
	placeholder?: string
}
