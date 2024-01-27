import { z } from 'zod'
import { ConnectorType } from '../../connectors'

export const sampleDataSchema = z.object({
	currentSelectedData: z.unknown(),
	customizedInputs: z.record(z.any()),
	lastTestDate: z.date(),
})

const stepNameSchema = z.string().regex(/^([a-zA-Z]+)_(\d+)$/)
export const baseStepSchema = z.object({
	name: stepNameSchema,
	displayName: z.string(),
	valid: z.boolean(),
	// type: z.nativeEnum(ActionType).or(z.nativeEnum(TriggerType)),
	// nextActionName: z.string().optional(),
	nextActionName: z.string(),
})

export const sampleDataSettingsObjectSchema = z.object({
	currentSelectedData: z.any().optional(),
	customizedInputs: z.record(z.any()).optional(),
	lastTestDate: z.date().optional(),
})

export const baseConnectorSettingsSchema = z.object({
	connectorName: z.string(), // '@market-connecotr/binance'
	connectorVersion: z.string(),
	connectorType: z.nativeEnum(ConnectorType), // Officail, Custom
	input: z.record(z.any()).and(z.object({ auth: z.string().optional() })),
	inputUiInfo: sampleDataSettingsObjectSchema,
	sampleData: sampleDataSchema.optional(),
})

export interface SampleData extends z.infer<typeof sampleDataSchema> {}
export interface BaseStep extends z.infer<typeof baseStepSchema> {}
export interface SampleDataSettingsObject extends z.infer<typeof sampleDataSettingsObjectSchema> {}
export interface BaseConnectorSettings extends z.infer<typeof baseConnectorSettingsSchema> {}
