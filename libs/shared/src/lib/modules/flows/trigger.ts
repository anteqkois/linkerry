import { BaseConnectorSettings, BaseStep, SampleData } from './base'

export enum TriggerType {
	Empty = 'Empty',
	Connector = 'Connector',
	Webhook = 'Webhook',
}

export interface TriggerEmpty extends BaseStep {
	type: TriggerType.Empty
}
export const isEmptyTrigger = (trigger: Trigger): trigger is TriggerEmpty => {
	return trigger.type === TriggerType.Empty
}

export interface TriggerWebhook extends BaseStep {
	type: TriggerType.Webhook
	settings: {
		sampleData: SampleData
	}
}
export const isWebhookTrigger = (trigger: Trigger): trigger is TriggerWebhook => {
	return trigger.type === TriggerType.Webhook
}

export interface TriggerConnector extends BaseStep {
	type: TriggerType.Connector
	settings: BaseConnectorSettings
}
export const isConnectorTrigger = (trigger: Trigger): trigger is TriggerConnector => {
	return trigger.type === TriggerType.Connector
}

export type Trigger = TriggerEmpty | TriggerWebhook | TriggerConnector
// export type Trigger<T extends TriggerType = TriggerType> = T extends TriggerType.Connector
// 	? TriggerConnector
// 	: T extends TriggerType.Webhook
// 	? TriggerWebhook
// 	: T extends TriggerType.Empty
// 	? TriggerEmpty
// 	: TriggerEmpty | TriggerWebhook | TriggerConnector
