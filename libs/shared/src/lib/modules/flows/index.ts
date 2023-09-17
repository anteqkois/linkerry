import { DbTimestamp, Id } from '../../common/database'
import { StepTrigger } from './step'

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
  triggers: StepTrigger[]
  valid: boolean
  state: FlowState
}
