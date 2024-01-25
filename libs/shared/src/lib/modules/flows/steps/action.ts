import { z } from 'zod'
import { baseConnectorSettingsSchema, baseStepSchema } from './base'

export enum ActionType {
  // Code = 'Code',
  CONNECTOR = 'CONNECTOR',
  BRANCH = 'BRANCH',
  MERGE_BRANCH = 'MERGE_BRANCH',
	LOOP_ON_ITEMS = 'LOOP_ON_ITEMS',
}

/* BASE */
export const baseActionSchema = baseStepSchema.merge(
	z.object({
		type: z.nativeEnum(ActionType),
		settings: z.any(),
	}),
)
export interface BaseAction extends z.infer<typeof baseActionSchema> {}

/* CONNECTOR */
const actionConnectorSettingsSchema = baseConnectorSettingsSchema.merge(
	z.object({
		actionName: z.string(), // 'send_xyz'
	}),
)

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
const actionBranchSettingsSchema = baseConnectorSettingsSchema.merge(
	z.object({
		conditions: z.array(z.array(z.object({})))
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

export type Action = ActionConnector | ActionBranch
