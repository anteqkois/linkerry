import { DatabaseTimestamp, Id } from "../../common"
import { ExecutionOutput, ExecutionOutputStatus, PauseMetadata } from "./execution/execution-output"

export enum RunTerminationReason {
    STOPPED_BY_HOOK = 'STOPPED_BY_HOOK',
}

export interface FlowRun extends DatabaseTimestamp  {
    _id: Id
    projectId: Id
    flowId: Id
    // tags?: string[]
    flowVersionId: Id
    flowDisplayName: string
    terminationReason?: RunTerminationReason
    logsFileId: Id | null
    // logsFileId:  null
    tasks?: number
    status: ExecutionOutputStatus
    startTime: string
    finishTime: string
    environment: RunEnvironment
    pauseMetadata?: PauseMetadata | null
    executionOutput?: ExecutionOutput
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
