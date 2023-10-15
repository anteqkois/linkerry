import { TriggerStrategy, WebhookHandshakeConfiguration } from './trigger/trigger'
import { ConnectorAuthProperty, ConnectorPropertyMap } from './property'

export type ConnectorBase = {
  _id?: string
  name: string
  displayName: string
  logoUrl: string
  description: string
  // projectId?: ProjectId;
  // directoryName?: string;
  auth?: ConnectorAuthProperty
  version: string
  minimumSupportedRelease: string
  maximumSupportedRelease: string
}

export type ActionBase = {
  name: string
  displayName: string
  description: string
  props: ConnectorPropertyMap
  requireAuth: boolean
}

export type TriggerBase = ActionBase & {
  type: TriggerStrategy
  sampleData: unknown
  handshakeConfiguration?: WebhookHandshakeConfiguration;
}

export type ConnectorMetadata = ConnectorBase & {
  actions: Record<string, ActionBase>
  triggers: Record<string, TriggerBase>
}

export type ConnectorMetadataSummary = Omit<ConnectorMetadata, 'actions' | 'triggers'> & {
  actions: number
  triggers: number
}
