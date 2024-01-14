import { z } from 'zod'
import { StepName, baseConnectorSettingsSchema, baseStepSchema, sampleDataSchema } from './base'

export enum TriggerType {
	Empty = 'Empty',
	Connector = 'Connector',
	Webhook = 'Webhook',
}

export const baseTriggerSchema = baseStepSchema.merge(
	z.object({
		type: z.nativeEnum(TriggerType),
		settings: z.any(),
	}),
)

export const triggerEmptySchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.Empty]),
		settings: z.object({}),
	}),
)
export const isEmptyTrigger = (trigger: Trigger): trigger is TriggerEmpty => {
	return trigger.type === TriggerType.Empty
}

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

export const triggerConnectorSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.Connector]),
		settings: baseConnectorSettingsSchema.merge(
			z.object({
				triggerName: z.string(), // 'new_row'
			}),
		),
	}),
)

export const isConnectorTrigger = (trigger: Trigger): trigger is TriggerConnector => {
	return trigger.type === TriggerType.Connector
}

export interface BaseTrigger extends z.infer<typeof baseTriggerSchema> {}
export interface TriggerEmpty extends z.infer<typeof triggerEmptySchema> {}
export interface TriggerWebhook extends z.infer<typeof triggerWebhookSchema> {}
export interface TriggerConnector extends z.infer<typeof triggerConnectorSchema> {}
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
		settings: {},
	}
}
