import { DatabaseTimestamp, Id, Nullable } from "../../common"
import { FlowRunStatus, PauseMetadata } from "./execution/flow-execution"
import { StepOutput } from "./execution/step-output"

export enum RunTerminationReason {
    STOPPED_BY_HOOK = 'STOPPED_BY_HOOK',
}

export interface FlowRun extends DatabaseTimestamp  {
    _id: Id
    projectId: Id
    flowId: Id
    tags?: string[]
    flowVersionId: Id
    flowDisplayName: string
    terminationReason?: RunTerminationReason
    logsFileId: Nullable<Id>
    tasks?: number
    status: FlowRunStatus
    startTime: string
    finishTime: string
    environment: RunEnvironment
    pauseMetadata?: PauseMetadata
		steps: Record<string, StepOutput>
}

export enum RunEnvironment {
    PRODUCTION = 'PRODUCTION',
    TESTING = 'TESTING',
}

export enum FlowRetryStrategy {
    ON_LATEST_VERSION = 'ON_LATEST_VERSION',
    FROM_FAILED_STEP = 'FROM_FAILED_STEP',
}

export type FlowRetryPayload = {
    strategy: FlowRetryStrategy
}
