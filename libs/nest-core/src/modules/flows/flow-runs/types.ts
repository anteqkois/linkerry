import { ExecutionType, FlowRetryStrategy, FlowRun, Id, PauseMetadata, RunEnvironment } from '@linkerry/shared'
import { FlowRunDocument } from './schemas/flow-runs.schema'

export interface GetOrCreateParams {
  id?: Id
  projectId: Id
  flowId: Id
  flowVersionId: Id
  flowDisplayName: string
  environment: RunEnvironment
}

export enum HookType {
  BEFORE_LOG = 'BEFORE_LOG',
  AFTER_LOG = 'AFTER_LOG',
}

export interface GetOneParams {
  id: Id
  projectId: Id | undefined
}

export interface StartParams {
  projectId: Id
  flowVersionId: Id
  flowRunId?: Id
  environment: RunEnvironment
  payload: unknown
  synchronousHandlerId?: string
  hookType?: HookType
  executionType: ExecutionType
}

export interface SideEffectStartParams {
  flowRun: FlowRunDocument
  executionType: ExecutionType
  payload: unknown
  synchronousHandlerId?: string
  hookType?: HookType
}

export interface TestParams {
  projectId: Id
  flowVersionId: Id
}

export interface PauseParams {
  flowRunId: Id
  logFileId: Id
  pauseMetadata: PauseMetadata
}

export interface SideEffectPauseParams {
  flowRun: FlowRun
}

export interface RetryParams {
  flowRunId: Id
  strategy: FlowRetryStrategy
}

export interface GetAllProdRuns {
  projectId: Id
  created: string
}
