import { z } from 'zod'
import { booleanOrBooleanStringSchema, flowStepNameSchema } from '../../../common/zod'
import { ConnectorType, PackageType } from '../../connectors'

export const sampleDataSchema = z.object({
	currentSelectedData: z.unknown(),
	customizedInputs: z.record(z.any()),
	lastTestDate: z.date(),
})

export const baseStepSchema = z.object({
	name: flowStepNameSchema,
	displayName: z.string(),
	valid: booleanOrBooleanStringSchema,
	// type: z.nativeEnum(ActionType).or(z.nativeEnum(TriggerType)),
	nextActionName: flowStepNameSchema.or(z.string().max(0)),
})

export const sampleDataSettingsObjectSchema = z.object({
	currentSelectedData: z.any().optional(),
	customizedInputs: z.record(z.any()).optional(),
	lastTestDate: z.string().optional(),
})

export const baseStepSettingsSchema = z.object({
	packageType: z.nativeEnum(PackageType),
	connectorName: z.string(), // '@linkerry/binance'
	connectorVersion: z.string(),
	connectorType: z.nativeEnum(ConnectorType),
	input: z.record(z.any()).and(z.object({ auth: z.string().optional() })),
	inputUiInfo: sampleDataSettingsObjectSchema,
})

export const isStepBaseSettings = (settings: unknown): settings is BaseStepSettings => {
	const response = baseStepSettingsSchema.safeParse(settings)
	return response.success
}

export interface SampleData extends z.infer<typeof sampleDataSchema> {}
export interface BaseStep extends z.infer<typeof baseStepSchema> {}
export interface SampleDataSettingsObject extends z.infer<typeof sampleDataSettingsObjectSchema> {}
export interface BaseStepSettings extends z.infer<typeof baseStepSettingsSchema> {}
