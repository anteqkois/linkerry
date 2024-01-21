import { z } from 'zod'
import { StepName, baseConnectorSettingsSchema, baseStepSchema, sampleDataSchema } from './base'

export enum TriggerType {
	Empty = 'Empty',
	Connector = 'Connector',
	Webhook = 'Webhook',
}

/* BASE */
export const baseTriggerSchema = baseStepSchema.merge(
	z.object({
		type: z.nativeEnum(TriggerType),
		settings: z.any(),
	}),
)
export interface BaseTrigger extends z.infer<typeof baseTriggerSchema> {}

/* EMPTY */
export const triggerEmptySchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.Empty]),
		settings: z.any(),
	}),
)
export const isEmptyTrigger = (trigger: Trigger): trigger is TriggerEmpty => {
	return trigger.type === TriggerType.Empty
}
export interface TriggerEmpty extends z.infer<typeof triggerEmptySchema> {}

/* WEBHOOK */
export const triggerWebhookSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.Webhook]),
		settings: z.object({
			sampleData: sampleDataSchema,
		}),
	}),
)

export const isWebhookTrigger = (trigger: Trigger): trigger is TriggerWebhook => {
	return trigger.type === TriggerType.Webhook
}
export interface TriggerWebhook extends z.infer<typeof triggerWebhookSchema> {}

/* CONNECTOR */
const triggerConnectorSettingsSchema = baseConnectorSettingsSchema.merge(
	z.object({
		triggerName: z.string(), // 'new_row'
	}),
)

export const triggerConnectorSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.Connector]),
		settings: triggerConnectorSettingsSchema,
	}),
)

export const isConnectorTrigger = (trigger: Trigger): trigger is TriggerConnector => {
	return trigger.type === TriggerType.Connector
}

export interface TriggerConnector extends z.infer<typeof triggerConnectorSchema> {}
export interface TriggerConnectorSettings extends z.infer<typeof triggerConnectorSettingsSchema> {}

/* TRIGGER */
export type Trigger = TriggerEmpty | TriggerWebhook | TriggerConnector

export function isTrigger(data: unknown): data is Trigger {
	const result = baseTriggerSchema.safeParse(data)
	if (result.success === false) {
		console.error(result.error.errors)
		return false
	}

	return true
}

export const generateEmptyTrigger = (name: StepName): TriggerEmpty => {
	return {
		name,
		displayName: 'Select trigger',
		type: TriggerType.Empty,
		valid: false,
		nextActionName: '',
	}
}
