// export enum ConfigType {
// 	minimumPollingInterval = 'minimumPollingInterval',
// 	connections = 'connections',
// 	connectors = 'connectors', // [core, pro, base]
// 	tasks = 'tasks',
// 	projectMembers = 'projectMembers',
// 	flowSteps = 'flowSteps',
// 	triggersAmount = 'triggersAmount',
// 	flows = 'flows',
// 	fileUploads = 'fileUploads',
// 	flowRunIntervalGap = 'flowRunIntervalGap', // [0m, 1m, 15m]
// 	maximumActiveFlows = 'maxiumumActiveFlows',
// 	maximumExecutionTime = 'maxiumum',
// }

export interface ProductConfig {
	minimumPollingInterval: number
	connections: number
	connectors: number
	tasks: number
	projectMembers: number
	flowSteps: number
	triggersAmount: number
	flows: number
	fileUploadsMB: number
	flowRunIntervalGap: number
	maximumActiveFlows: number
	maximumExecutionTime: number
}

export interface ProductConfigItem {
	name: string
	displayName: string
	description: string
}
