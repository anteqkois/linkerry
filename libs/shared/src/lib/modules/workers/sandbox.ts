import { Id } from "../../common"

export enum SandBoxCacheType {
	CONNECTOR = 'CONNECTOR', // Only connector data
	FLOW = 'FLOW', // Only given flow cached
	CODE = 'CODE',
	NONE = 'NONE',
}

export type TypedProvisionCacheInfo<T extends SandBoxCacheType = SandBoxCacheType> = T extends SandBoxCacheType.CODE
	? CodeProvisionCacheInfo
	: T extends SandBoxCacheType.FLOW
	? FlowProvisionCacheInfo
	: T extends SandBoxCacheType.NONE
	? NoneProvisionCacheInfo
	: T extends SandBoxCacheType.CONNECTOR
	? ConnectorProvisionCacheInfo
	: never

export type ProvisionCacheInfo = TypedProvisionCacheInfo

export const extractProvisionCacheKey = (params: ProvisionCacheInfo): string => {
	switch (params.type) {
		case SandBoxCacheType.CODE:
			return extractCodeCacheKey(params)
		case SandBoxCacheType.FLOW:
			return extractFlowCacheKey(params)
		case SandBoxCacheType.NONE:
			return extractNoneCacheKey(params)
		case SandBoxCacheType.CONNECTOR:
			return extractConnectorCacheKey(params)
	}
}

const extractCodeCacheKey = ({ sourceCodeHash }: CodeProvisionCacheInfo): string => {
	return `CODE-sourceCodeHash-${sourceCodeHash}`
}

const extractFlowCacheKey = ({ flowVersionId }: FlowProvisionCacheInfo): string => {
	return `FLOW-flowVersionId-${flowVersionId}`
}

const extractNoneCacheKey = (_params: NoneProvisionCacheInfo): string => {
	// return `NONE-apId-${apId()}`
	return `NONE-mcId`
}

const extractConnectorCacheKey = ({ connectorName, connectorVersion }: ConnectorProvisionCacheInfo): string => {
	return `CONNECOR-connectorName-${connectorName}-connectorVersion-${connectorVersion}`
}

type BaseProvisionCacheInfo<T extends SandBoxCacheType> = {
	type: T
}

type CodeProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.CODE> & {
	sourceCodeHash: string
}

type FlowProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.FLOW> & {
	flowVersionId: Id
}

type NoneProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.NONE>

type ConnectorProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.CONNECTOR> & {
	connectorName: string
	connectorVersion: string
}
