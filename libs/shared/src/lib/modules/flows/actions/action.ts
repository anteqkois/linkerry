import { z } from 'zod'
import { baseStepSchema, baseStepSettingsSchema } from '../steps/base'
import { booleanOrBooleanStringSchema } from '../../../common/zod'

export enum ActionType {
	// Code = 'Code',
	CONNECTOR = 'CONNECTOR',
	BRANCH = 'BRANCH',
	MERGE_BRANCH = 'MERGE_BRANCH',
	LOOP_ON_ITEMS = 'LOOP_ON_ITEMS',
}

export const actionErrorHandlingOptionsSchema = z.object({
	continueOnFailure: z
		.object({
			value: booleanOrBooleanStringSchema,
		})
		.optional(),
	retryOnFailure: z
		.object({
			value: booleanOrBooleanStringSchema,
		})
		.optional(),
})
export interface ActionErrorHandlingOptions extends z.infer<typeof actionErrorHandlingOptionsSchema> {}

/* BASE */
export const baseActionSettingsSchema = baseStepSettingsSchema.merge(
	z.object({
		actionName: z.string(), // 'send_xyz'
		errorHandlingOptions: actionErrorHandlingOptionsSchema.optional(),
	}),
)
export interface BaseAction extends z.infer<typeof baseActionSchema> {}

export const baseActionSchema = baseStepSchema.merge(
	z.object({
		type: z.nativeEnum(ActionType),
		settings: baseActionSettingsSchema,
	}),
)
export interface BaseAction extends z.infer<typeof baseActionSchema> {}

/* CONNECTOR */
const actionConnectorSettingsSchema = baseActionSettingsSchema
export interface ActionConnectorSettings extends z.infer<typeof actionConnectorSettingsSchema> {}

export const actionConnectorSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([ActionType.CONNECTOR]),
		settings: actionConnectorSettingsSchema,
	}),
)
export interface ActionConnector extends z.infer<typeof actionConnectorSchema> {}

export const isConnectorAction = (action: Action): action is ActionConnector => {
	return action.type === ActionType.CONNECTOR
}

/* BRANCH */
const actionBranchSettingsSchema = baseActionSettingsSchema.merge(
	z.object({
		conditions: z.array(z.array(z.object({}))),
	}),
)
export interface ActionBranchSettings extends z.infer<typeof actionBranchSettingsSchema> {}

export const actionBranchSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([ActionType.BRANCH]),
		settings: actionBranchSettingsSchema,
		onSuccessActionName: z.string(),
		onFailureActionName: z.string(),
	}),
)
export interface ActionBranch extends z.infer<typeof actionBranchSchema> {}

export const isBranchAction = (action: Action): action is ActionBranch => {
	return action.type === ActionType.BRANCH
}

/* ACTION */
export const actionSchema = z.union([actionConnectorSchema, actionBranchSchema])
export type Action =  z.infer<typeof actionSchema>

export function isAction(data: unknown): data is Action {
	if (data && typeof data === 'object' && 'name' in data && typeof data.name === 'string' && data.name.startsWith('action')) return true
	return false
}
