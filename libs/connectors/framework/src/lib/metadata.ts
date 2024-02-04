import { ConnectorGroup, ConnectorType } from '@linkerry/shared'
import { ErrorHandlingOptionsParam } from './action/action'
import { ConnectorAuthProperty, ConnectorPropertyMap } from './property'
import { ConnectorTag } from './tags'
import { TriggerStrategy, WebhookHandshakeConfiguration } from './trigger/trigger'

export type ConnectorBase = {
	_id: string
	name: string
	displayName: string
	logoUrl: string
	description: string
	auth?: ConnectorAuthProperty
	version: string
	minimumSupportedRelease: string
	maximumSupportedRelease: string
	tags: ConnectorTag[]
}

type StepBase = {
	name: string
	displayName: string
	description: string
	props?: ConnectorPropertyMap
	requireAuth: boolean
	errorHandlingOptions?: ErrorHandlingOptionsParam
}

export type ActionBase = StepBase

export type TriggerBase = Omit<StepBase, 'requireAuth'> & {
	type: TriggerStrategy
	sampleData: unknown
	handshakeConfiguration?: WebhookHandshakeConfiguration
}

export type ConnectorMetadata = ConnectorBase & {
	actions: Record<string, ActionBase>
	triggers: Record<string, TriggerBase>
	group: ConnectorGroup
	connectorType: ConnectorType
}

export type ConnectorMetadataSummary = Omit<ConnectorMetadata, 'actions' | 'triggers'> & {
	actions: number
	triggers: number
}
