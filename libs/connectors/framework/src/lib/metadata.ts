import { ConnectorGroup, ConnectorType } from '@linkerry/shared'
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

export type ActionBase = {
  name: string
  displayName: string
  description: string
  props?: ConnectorPropertyMap
  requireAuth: boolean
}

export type TriggerBase = ActionBase & {
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
