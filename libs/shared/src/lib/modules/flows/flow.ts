import { DbTimestamp, Id } from '../../common/database'
import { Trigger } from './trigger'

export enum FlowStatus {
  Published = 'Published',
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
  displayName: string
  flow: Id
  triggers: Trigger[]
  valid: boolean
  state: FlowState
}
