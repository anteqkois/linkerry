import { Id } from '../../../common'
import { AppConnectionValue } from '../../app-connection'
import { ConnectorPackage } from '../../connectors'
import { ExecutionState, ExecutionType } from '../../flow-runs'
import { FlowVersion } from '../flow-versions'

export enum EngineOperationType {
  EXTRACT_CONNECTOR_METADATA = 'EXTRACT_CONNECTOR_METADATA',
  EXECUTE_STEP = 'EXECUTE_STEP',
  EXECUTE_TEST_FLOW = 'EXECUTE_TEST_FLOW',
  EXECUTE_FLOW = 'EXECUTE_FLOW',
  EXECUTE_PROPERTY = 'EXECUTE_PROPERTY',
  EXECUTE_TRIGGER_HOOK = 'EXECUTE_TRIGGER_HOOK',
  EXECUTE_VALIDATE_AUTH = 'EXECUTE_VALIDATE_AUTH',
}

export enum TriggerHookType {
  ON_ENABLE = 'ON_ENABLE',
  ON_DISABLE = 'ON_DISABLE',
  HANDSHAKE = 'HANDSHAKE',
  RENEW = 'RENEW',
  RUN = 'RUN',
  TEST = 'TEST',
}

export type EngineOperation =
  | ExecuteStepOperation
  | ExecuteFlowOperation
  | ExecutePropsOptions
  | ExecuteTriggerOperation<TriggerHookType>
  | ExecuteExtractConnectorMetadata
  | ExecuteValidateAuthOperation

export type BaseEngineOperation = {
  projectId: Id
  workerToken: string
  serverUrl: string
}

export type ExecuteValidateAuthOperation = BaseEngineOperation & {
  connector: ConnectorPackage
  auth: AppConnectionValue
}

export type ExecuteExtractConnectorMetadata = ConnectorPackage & { projectId: string }

export type ExecuteStepOperation = BaseEngineOperation & {
  stepName: string
  flowVersion: FlowVersion
}

export type ExecutePropsOptions = BaseEngineOperation & {
  connector: ConnectorPackage
  propertyName: string
  stepName: string
  flowVersion: FlowVersion
  input: Record<string, unknown>
  searchValue?: string
}

type BaseExecuteFlowOperation<T extends ExecutionType> = BaseEngineOperation & {
  flowVersion: FlowVersion
  flowRunId: Id
  executionType: T
}

export type BeginExecuteFlowOperation = BaseExecuteFlowOperation<ExecutionType.BEGIN> & {
  triggerPayload: unknown
}

export type ResumeExecuteFlowOperation = BaseExecuteFlowOperation<ExecutionType.RESUME> & {
  tasks: number
  resumePayload: unknown
} & ExecutionState

export type ExecuteFlowOperation = BeginExecuteFlowOperation | ResumeExecuteFlowOperation

export type EngineTestOperation = BeginExecuteFlowOperation & {
  /**
   * original flow version that the current test flow version is derived from.
   * Used to generate the test execution context.
   */
  sourceFlowVersion: FlowVersion
}

export type ExecuteTriggerOperation<HT extends TriggerHookType> = BaseEngineOperation & {
  hookType: HT
  flowVersion: FlowVersion
  webhookUrl: string
  triggerName: string
  triggerPayload?: TriggerPayload
  // edition?: string
  appWebhookUrl?: string
  webhookSecret?: string
}

export type TriggerPayload<T = unknown> = {
  body: T
  headers: Record<string, string>
  queryParams: Record<string, string>
}

export type EventPayload<B = unknown> = {
  body: B
  rawBody?: unknown
  method: string
  headers: Record<string, string>
  queryParams: Record<string, string>
}

export type ParseEventResponse = {
  event?: string
  identifierValue?: string
  reply?: {
    headers: Record<string, string>
    body: unknown
  }
}

export type AppEventListener = {
  events: string[]
  identifierValue: string
}

type ExecuteTestOrRunTriggerResponse = {
  success: boolean
  message?: string
  output: unknown[]
}

type ExecuteHandshakeTriggerResponse = {
  success: boolean
  message?: string
  response?: {
    status: number
    body?: unknown
    headers?: Record<string, string>
  }
}

type ExecuteOnEnableTriggerResponse = {
  listeners: AppEventListener[]
  scheduleOptions?: ScheduleOptions
}

export type ExecuteTriggerResponse<H extends TriggerHookType> = H extends TriggerHookType.RUN
  ? ExecuteTestOrRunTriggerResponse
  : H extends TriggerHookType.HANDSHAKE
  ? ExecuteHandshakeTriggerResponse
  : H extends TriggerHookType.TEST
  ? ExecuteTestOrRunTriggerResponse
  : H extends TriggerHookType.ON_DISABLE
  ? Record<string, never>
  : ExecuteOnEnableTriggerResponse

export type ExecuteActionResponse = {
  success: boolean
  output: unknown
  message?: string
}

type BaseExecuteValidateAuthResponseOutput<Valid extends boolean> = {
  valid: Valid
}

type ValidExecuteValidateAuthResponseOutput = BaseExecuteValidateAuthResponseOutput<true>

type InvalidExecuteValidateAuthResponseOutput = BaseExecuteValidateAuthResponseOutput<false> & {
  error: string
}
export type ExecuteValidateAuthResponse = ValidExecuteValidateAuthResponseOutput | InvalidExecuteValidateAuthResponseOutput

export type ScheduleOptions = {
  cronExpression: string
  timezone: string
}

export type EngineResponse<T> = {
  status: EngineResponseStatus
  response: T
}

export enum EngineResponseStatus {
  OK = 'OK',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT',
}
