import { Id } from '../../../common'
import { BaseConnectorSettings, BaseStep } from './base'

export enum ActionType {
  Connector = 'Connector',
  // Code = 'Code',
  Branch = 'Branch',
  MergeBranch = 'MergeBranch',
	LoopOnItems = 'LoopOnItems',
}

export interface ActionConnector extends BaseStep {
  type: ActionType.Connector
	settings: BaseConnectorSettings
}

export interface ActionBranch extends BaseStep {
  type: ActionType.Branch
	settings: BaseConnectorSettings
	nextActionName: Id,
	onSuccessActionId: Id,
	onFailureActionId: Id,
}

export type Action = ActionConnector | ActionBranch
