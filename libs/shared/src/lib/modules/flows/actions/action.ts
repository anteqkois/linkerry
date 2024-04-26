import { ConnectorNameType, ShortStringType, StepNameType } from '../../../common/type-validators'
import { BaseStep, BaseStepSettings } from '../steps'

export enum ActionType {
	// Code = 'Code',
	CONNECTOR = 'CONNECTOR',
	BRANCH = 'BRANCH',
	MERGE_BRANCH = 'MERGE_BRANCH',
	LOOP_ON_ITEMS = 'LOOP_ON_ITEMS',
}

export interface ActionErrorHandlingOptions {
	continueOnFailure?: { value: boolean }
	retryOnFailure?: { value: boolean }
}

/* BASE */
export interface BaseActionSettings extends BaseStepSettings {
	actionName: ShortStringType // 'send_xyz'
	errorHandlingOptions?: ActionErrorHandlingOptions
}

export interface BaseAction extends BaseStep {
	type: ActionType
	settings: BaseActionSettings
}

/* CONNECTOR */
export type ActionConnectorSettings = BaseActionSettings

export interface ActionConnector extends BaseStep {
	type: ActionType.CONNECTOR,
	settings: ActionConnectorSettings,
}

export const isConnectorAction = (action: Action): action is ActionConnector => {
	return action.type === ActionType.CONNECTOR
}

/* BRANCH */
export interface ActionBranchSettings extends BaseActionSettings{
	conditions: Array<Array<object>>
}

export interface ActionBranch extends BaseStep{
	type: ActionType.BRANCH,
	settings: ActionBranchSettings,
	onSuccessActionName: StepNameType,
	onFailureActionName: ConnectorNameType,
}

export const isBranchAction = (action: Action): action is ActionBranch => {
	return action.type === ActionType.BRANCH
}
/* ACTION */
export type Action = ActionConnector | ActionBranch

export function isAction(data: unknown): data is Action {
	if (data && typeof data === 'object' && 'name' in data && typeof data.name === 'string' && data.name.startsWith('action')) return true
	return false
}
