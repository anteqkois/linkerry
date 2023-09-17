import { BaseStep } from './base'

export enum ActionType {
  Connector = 'Connector',
  // Code = 'Code',
  Branch = 'Branch',
  MergeBranch = 'MergeBranch',
}

export interface ActionConnector extends BaseStep {
  type: ActionType.Connector
}

export type Action = ActionConnector // | other
