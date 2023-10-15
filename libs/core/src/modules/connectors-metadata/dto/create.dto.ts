import { ActionBase, ConnectorAuthProperty, ConnectorMetadata, TriggerBase } from '@market-connector/connectors-framework'

export class CreateDto implements ConnectorMetadata {
  name: string
  displayName: string
  description: string
  logoUrl: string
  auth?: ConnectorAuthProperty | undefined
  actions: Record<string, ActionBase>
  triggers: Record<string, TriggerBase>
  version: string
  maximumSupportedRelease: string
  minimumSupportedRelease: string
}
