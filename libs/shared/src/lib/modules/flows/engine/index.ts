import { FlowVersion } from "../flow"
import { BaseEngineOperation } from "./base"

export enum TriggerHookType {
	ON_ENABLE = 'ON_ENABLE',
	ON_DISABLE = 'ON_DISABLE',
	HANDSHAKE = 'HANDSHAKE',
	RUN = 'RUN',
	TEST = 'TEST',
}


export type ExecuteTriggerOperation<HT extends TriggerHookType> = BaseEngineOperation & {
	hookType: HT
	flowVersion: FlowVersion
	webhookUrl: string
	triggerName: string
	triggerPayload?: TriggerPayload
	edition?: string
	appWebhookUrl?: string
	webhookSecret?: string
}

export type TriggerPayload<T = unknown> = {
	body: T
	headers: Record<string, string>
	queryParams: Record<string, string>
}
