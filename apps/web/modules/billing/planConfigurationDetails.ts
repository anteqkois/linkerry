import { ErrorCodeQuota, ProductConfig } from '@linkerry/shared'

export interface PlanConfigurationDetailsValue {
	displayName: string
	errorCode: ErrorCodeQuota
	name: string
	// description:''
}

export type PlanConfigurationDetails = Record<keyof ProductConfig, PlanConfigurationDetailsValue>

/* UI will show in the same order */
export const planConfigurationDetails: PlanConfigurationDetails = {
	tasks: { name: 'tasks', displayName: 'Avaible tasks amount per month', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_TASKS },
	connections: { name: 'connections', displayName: 'Number of added app connections', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_CONNECTIONS },
	flows: { name: 'flows', displayName: 'Created flows amount', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_FLOWS },
	flowSteps: { name: 'flowSteps', displayName: 'Number of steps for single flow', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_FLOW_STEPS },
	connectors: { name: 'connectors', displayName: 'Avaible connectors', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_CONNECTORS },
	maximumActiveFlows: { name: 'maximumActiveFlows', displayName: 'Active Flows', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_MAXIUMUM_ACTIVE_FLOWS },
	fileUploadsMB: { name: 'fileUploadsMB', displayName: 'Files upload space [MB]', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_FILE_UPLOADS_MB },
	flowRunIntervalGap: {
		name: 'flowRunIntervalGap',
		displayName: 'Time between single flow runs',
		errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_FLOW_RUN_INTERVAL_GAP,
	},
	minimumPollingInterval: {
		name: 'minimumPollingInterval',
		displayName: 'Pooling interval for trigger connectors',
		errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_MINIMUM_POLLING_INTERVAL,
	},
	maximumExecutionTime: {
		name: 'maximumExecutionTime',
		displayName: 'Maximum flow time execution',
		errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_MAXIMUM_EXECUTION_TIME,
	},
	projectMembers: { name: 'projectMembers', displayName: 'Project members', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_PROJECT_MEMBERS },
	triggersAmount: { name: 'triggersAmount', displayName: 'Triggers amount in single flow', errorCode: ErrorCodeQuota.QUOTA_EXCEEDED_TRIGGERS_AMOUNT },
}
