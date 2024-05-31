import { BaseDatabaseFields, Id } from '../../../common'
import { FlowVersion } from '../flow-versions'

export interface TriggerEvent extends BaseDatabaseFields {
  _id: Id
  flowId: Id
  projectId: Id
  sourceName: string //'@linkerry/connector-google-sheets@~0.7.4:new_row'
  payload: any
}

export interface TriggerTestPoolResponse {
  triggerEvents: TriggerEvent[]
  flowVersion: FlowVersion
}

export interface WatchTriggerEventsWSInput {
  flowId: Id
  triggerName: string
}

export type WatchTriggerEventsWSResponseFailure = {
  error: boolean
  message: string
}

export type WatchTriggerEventsWSResponse =
  | {
      triggerEvents: TriggerEvent[]
      flowVersion: FlowVersion
    }
  | WatchTriggerEventsWSResponseFailure
