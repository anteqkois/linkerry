import { z } from 'zod'
import { baseStepSchema, baseStepSettingsSchema, sampleDataSchema } from '../steps/base'

export enum TriggerType {
	EMPTY = 'EMPTY',
	TRIGGER = 'TRIGGER',
	WEBHOOK = 'WEBHOOK',
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
		type: z.enum([TriggerType.EMPTY]),
		settings: z.any(),
	}),
)
export const isEmptyTrigger = (trigger: Trigger): trigger is TriggerEmpty => {
	return trigger.type === TriggerType.EMPTY
}
export interface TriggerEmpty extends z.infer<typeof triggerEmptySchema> {}

/* WEBHOOK */
export const triggerWebhookSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.WEBHOOK]),
		settings: z.object({
			sampleData: sampleDataSchema,
		}),
	}),
)

export const isWebhookTrigger = (trigger: Trigger): trigger is TriggerWebhook => {
	return trigger.type === TriggerType.WEBHOOK
}
export interface TriggerWebhook extends z.infer<typeof triggerWebhookSchema> {}

/* CONNECTOR */
const triggerConnectorSettingsSchema = baseStepSettingsSchema.merge(
	z.object({
		triggerName: z.string(), // 'new_row'
	}),
)

export const triggerConnectorSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.TRIGGER]),
		settings: triggerConnectorSettingsSchema,
	}),
)

export const isConnectorTrigger = (trigger: Trigger): trigger is TriggerConnector => {
	return trigger.type === TriggerType.TRIGGER
}

export interface TriggerConnector extends z.infer<typeof triggerConnectorSchema> {}
export interface TriggerConnectorSettings extends z.infer<typeof triggerConnectorSettingsSchema> {}

/* TRIGGER */
export type Trigger = TriggerEmpty | TriggerWebhook | TriggerConnector
export type TriggerNotEmpty = TriggerWebhook | TriggerConnector

export function isTrigger(data: unknown): data is Trigger {
	if (data && typeof data === 'object' && 'type' in data && Object.keys(TriggerType).includes((data.type as string) ?? '')) return true
	return false
}

export const generateEmptyTrigger = (name: string): TriggerEmpty => {
	return {
		name,
		displayName: 'Select trigger',
		type: TriggerType.EMPTY,
		valid: false,
		nextActionName: '',
	}
}

export const retriveStepNumber = (name: string): number => {
	const nameParts = name.split('_')
	return Number(nameParts[nameParts.length - 1])
}
