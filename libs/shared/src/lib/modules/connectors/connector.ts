export const EXACT_VERSION_PATTERN = /^[0-9]+\.[0-9]+\.[0-9]+$/
export const VERSION_PATTERN = /^([~^])?[0-9]+\.[0-9]+\.[0-9]+$/

export enum ConnectorsSource {
	CloudAndDb = 'CloudAndDb',
	Db = 'Db',
	File = 'File',
}

export enum ConnectorGroup {
	Core = 'Core',
	App = 'App',
}

export enum ConnectorType {
	Official = 'Official',
	Custom = 'Custom',
}

export type ConnectorPackage = {
	// packageType: PackageType
	connectorType: ConnectorType
	connectorName: string
	connectorVersion: string
}
