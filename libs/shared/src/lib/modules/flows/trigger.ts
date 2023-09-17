import { BaseConnectorSettings, BaseStep, SampleData } from './base'

export enum TriggerType {
  Empty = 'Empty',
  Connector = 'Connector',
  Webhook = 'Webhook',
}

export interface TriggerEmpty extends BaseStep {
  type: TriggerType.Empty
}

export interface TriggerWebhook extends BaseStep {
  type: TriggerType.Webhook
  settings: {
    sampleData: SampleData
  }
}

export interface TriggerConnector extends BaseStep {
  type: TriggerType.Connector
  settings: BaseConnectorSettings
}

export type Trigger = TriggerEmpty | TriggerWebhook | TriggerConnector
