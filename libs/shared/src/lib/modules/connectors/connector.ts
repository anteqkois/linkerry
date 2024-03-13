export const EXACT_VERSION_PATTERN = /^[0-9]+\.[0-9]+\.[0-9]+$/
export const VERSION_PATTERN = /^([~^])?[0-9]+\.[0-9]+\.[0-9]+$/

export enum PackageType {
	ARCHIVE = 'ARCHIVE',
	REGISTRY = 'REGISTRY',
}

export enum ConnectorsSource {
	CloudAndDb = 'CloudAndDb',
	Db = 'Db',
	File = 'File',
}

export enum ConnectorGroup {
	CORE = 'CORE',
	APP = 'APP',
}

export enum ConnectorType {
	OFFICIAL = 'OFFICIAL',
	CUSTOM = 'CUSTOM',
}

export type PrivateConnectorPackage = {
	packageType: PackageType.ARCHIVE
	connectorType: ConnectorType
	connectorName: string
	connectorVersion: string
	archiveId: string
}

export type PublicConnectorPackage = {
	packageType: PackageType.REGISTRY
	connectorType: ConnectorType
	connectorName: string
	connectorVersion: string
}

export type ConnectorPackage = PrivateConnectorPackage | PublicConnectorPackage
