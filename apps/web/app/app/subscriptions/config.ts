import { ProductConfig } from '@linkerry/shared'

export interface ProductConfigurationDetailsValue {
	displayName: string
	// description:''
}

export type ProductConfigurationDetails = Record<keyof ProductConfig, ProductConfigurationDetailsValue>

/* UI will show in the same order */
export const productConfigurationDetails: ProductConfigurationDetails = {
	tasks: { displayName: 'Avaible tasks amount per month' },
	connections: { displayName: 'Number of added app connections' },
	flows: { displayName: 'Created flows amount' },
	flowSteps: { displayName: 'Number of steps for single flow' },
	connectors: { displayName: 'Avaible connectors' },
	maximumActiveFlows: { displayName: 'Active Flows' },
	fileUploadsMB: { displayName: 'Files upload space [MB]' },
	flowRunIntervalGap: { displayName: 'Time between single flow runs' },
	minimumPollingInterval: { displayName: 'Pooling interval for trigger connectors' },
	maximumExecutionTime: { displayName: 'Maximum flow time execution' },
	projectMembers: { displayName: 'Project members' },
	triggersAmount: { displayName: 'Triggers amount in single flow' },
}
