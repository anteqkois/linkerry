import { Id } from "../../common"
import { ConnectorNameType, VersionType } from "../../common/type-validators"

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
	connectorName: ConnectorNameType
	connectorVersion: VersionType
	archiveId: Id
}

export type PublicConnectorPackage = {
	packageType: PackageType.REGISTRY
	connectorType: ConnectorType
	connectorName: ConnectorNameType
	connectorVersion: VersionType
}

export type ConnectorPackage = PrivateConnectorPackage | PublicConnectorPackage
