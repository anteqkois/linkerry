import { ProductConfig } from '@linkerry/shared'

export interface ProductConfigurationDetailsValue {
	displayName: string
	// description:''
}

export type ProductConfigurationDetails = Record<keyof ProductConfig, ProductConfigurationDetailsValue>

export const productConfigurationDetails: ProductConfigurationDetails = {
	connections: { displayName: 'Number of added app connections' },
	connectors: { displayName: 'Avaible connectors' },
	fileUploadsMB: { displayName: 'Files upload space [MB]' },
	flowRunIntervalGap: { displayName: 'Time between single flow runs' },
	flows: { displayName: 'Created flows amount' },
	flowSteps: { displayName: 'Number of steps for single flow' },
	maximumActiveFlows: { displayName: 'Active Flows' },
	maximumExecutionTime: { displayName: 'Maximum flow time execution' },
	minimumPollingInterval: { displayName: 'Pooling interval for trigger connectors' },
	projectMembers: { displayName: 'Project members' },
	tasks: { displayName: 'Avaible tasks amount per month' },
	triggersAmount: { displayName: 'Triggers amount in single flow' },
}
