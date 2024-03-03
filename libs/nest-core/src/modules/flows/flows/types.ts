import { FlowVersion, Id } from "@linkerry/shared"

export interface LockFlowVersionIfNotLockedParams {
	flowVersion: FlowVersion
	userId: Id
	projectId: Id
}
