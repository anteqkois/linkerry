import { ConnectorGroup, ConnectorType, PackageType, TriggerStrategy, TriggerTestStrategy } from '@linkerry/shared'
import { ErrorHandlingOptionsParam } from './action/action'
import { ConnectorAuthProperty, ConnectorPropertyMap } from './property'
import { ConnectorTag } from './tags'
import { WebhookHandshakeConfiguration, WebhookRenewConfiguration } from './trigger/trigger'

export type ConnectorBase = {
	_id: string
	name: string
	displayName: string
	logoUrl: string
	description: string
	auth?: ConnectorAuthProperty
	// platformId?: string;
	// directoryPath?: string;
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

export type TriggerBase = StepBase & {
	type: TriggerStrategy
	sampleData: unknown
	handshakeConfiguration?: WebhookHandshakeConfiguration
	renewConfiguration: WebhookRenewConfiguration
	testStrategy: TriggerTestStrategy
}

// TODO ? move this type extensions on a backend?
interface ConnectorPackageMetadata {
	projectId?: string
	connectorType: ConnectorType
	packageType: PackageType
	archiveId?: string
}

export type ConnectorMetadata = ConnectorBase &
	ConnectorPackageMetadata & {
		actions: Record<string, ActionBase>
		triggers: Record<string, TriggerBase>
		group: ConnectorGroup
	}

export type ConnectorMetadataSummary = Omit<ConnectorMetadata, 'actions' | 'triggers'> & {
	actions: number
	triggers: number
}
