import { z } from 'zod'
import { baseStepSchema, baseStepSettingsSchema } from '../steps/base'

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
			value: z.boolean(),
		})
		.optional(),
	retryOnFailure: z
		.object({
			value: z.boolean(),
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

export const actionConnectorSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([ActionType.CONNECTOR]),
		settings: actionConnectorSettingsSchema,
	}),
)

export const isConnectorAction = (action: Action): action is ActionConnector => {
	return action.type === ActionType.CONNECTOR
}

export interface ActionConnector extends z.infer<typeof actionConnectorSchema> {}
export interface ActionConnectorSettings extends z.infer<typeof actionConnectorSettingsSchema> {}

/* BRANCH */
const actionBranchSettingsSchema = baseActionSettingsSchema.merge(
	z.object({
		conditions: z.array(z.array(z.object({}))),
	}),
)

export const actionBranchSchema = baseStepSchema.merge(
	z.object({
		type: z.enum([ActionType.BRANCH]),
		settings: actionBranchSettingsSchema,
		onSuccessActionName: z.string(),
		onFailureActionName: z.string(),
	}),
)

export const isBranchAction = (action: Action): action is ActionConnector => {
	return action.type === ActionType.CONNECTOR
}

export interface ActionBranch extends z.infer<typeof actionBranchSchema> {}
export interface ActionBranchSettings extends z.infer<typeof actionBranchSettingsSchema> {}

/* ACTION */
export type Action = ActionConnector | ActionBranch

export function isAction(data: unknown): data is Action {
	const result = baseActionSchema.safeParse(data)
	if (result.success === false) {
		console.error(result.error.errors)
		return false
	}

	return true
}
