import { FlowVersion, Id, TriggerPayload } from '@linkerry/shared'

export interface EnableTriggerHookParams {
  projectId: Id
  flowVersion: FlowVersion
  simulate: boolean
}

export interface DisableParams {
  projectId: Id
  flowVersion: FlowVersion
  simulate: boolean
  ignoreError?: boolean
}

export interface ExecuteTrigger {
  flowVersion: FlowVersion
  projectId: Id
  simulate: boolean
  payload: TriggerPayload
}

export interface ExecuteHandshakeParams {
  triggerName: string
  flowVersion: FlowVersion
  projectId: Id
  payload: TriggerPayload
}

export interface RenewWebhookParams {
  flowVersion: FlowVersion
  projectId: Id
  simulate: boolean
}
