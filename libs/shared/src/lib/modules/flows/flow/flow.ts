import { Id, TimestampDatabase } from '../../../common/database'
import { User } from '../../user'
import { Action } from '../actions/action'
import { Trigger } from '../triggers/trigger'

export enum FlowStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Unpublished = 'Unpublished',
}

export enum FlowState {
  Draft = 'Draft',
  Valid = 'Valid',
}

export interface Flow extends TimestampDatabase {
  _id: Id
  user: Id
  // projectId: Id
  // folderId: Id
  version: FlowVersion
  status: FlowStatus
}

export interface FlowVersion extends TimestampDatabase {
  _id: Id
  user: Id | User
  displayName: string
  flow: Id
  triggers: Trigger[]
  actions: Action[]
  valid: boolean
  state: FlowState
	stepsCount: number,
}
