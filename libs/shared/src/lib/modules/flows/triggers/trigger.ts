import { z } from 'zod'
import { baseStepSchema, baseStepSettingsSchema } from '../steps/base'

export enum TriggerType {
	EMPTY = 'EMPTY',
	CONNECTOR = 'CONNECTOR',
}

export enum TriggerStrategy {
	POLLING = 'POLLING',
	WEBHOOK = 'WEBHOOK',
	APP_WEBHOOK = 'APP_WEBHOOK',
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
export interface TriggerEmpty extends z.infer<typeof triggerEmptySchema> {}

export const isEmptyTrigger = (trigger: Trigger): trigger is TriggerEmpty => {
	return trigger.type === TriggerType.EMPTY
}

/* CONNECTOR */
const triggerConnectorSettingsSchema = baseStepSettingsSchema.merge(
	z.object({
		triggerName: z.string(), // 'new_row'
	}),
)
export interface TriggerConnectorSettings extends z.infer<typeof triggerConnectorSettingsSchema> {}

export const triggerConnectorSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([TriggerType.CONNECTOR]),
		settings: triggerConnectorSettingsSchema,
	}),
)
export interface TriggerConnector extends z.infer<typeof triggerConnectorSchema> {}

export const isConnectorTrigger = (trigger: any): trigger is TriggerConnector => {
	return trigger?.type === TriggerType.CONNECTOR
}

/* TRIGGER */
export const triggerSchema = z.union([triggerEmptySchema, triggerConnectorSchema])
export const triggerSchemaPartial = z.union([triggerEmptySchema.partial(), triggerConnectorSchema.partial()])
export type Trigger = z.infer<typeof triggerSchema>
export type TriggerNotEmpty = TriggerConnector

export function isTrigger(data: unknown): data is Trigger {
	if (data && typeof data === 'object' && 'name' in data && typeof data.name === 'string' && data.name.startsWith('trigger')) return true
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
