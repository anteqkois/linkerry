import { DbTimestamp, Id } from '../../common/database'
import { User } from '../user'
import { Trigger } from './trigger'

export enum FlowStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Unpublished = 'Unpublished',
}

export enum FlowState {
  Draft = 'Draft',
  Valid = 'Valid',
}

export interface Flow extends DbTimestamp {
  _id: Id
  user: Id
  // projectId: Id
  // folderId: Id
  version: FlowVersion
  status: FlowStatus
}

export interface FlowVersion extends DbTimestamp {
  _id: Id
  user: Id | User
  displayName: string
  flow: Id
  triggers: Trigger[]
  valid: boolean
  state: FlowState
}
