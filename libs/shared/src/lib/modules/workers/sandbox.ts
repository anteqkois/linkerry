import { Id } from "../../common"

export enum SandBoxCacheType {
	Connector = 'Connector', // Only connector data
	Flow = 'Flow', // Only given flow cached
	Code = 'Code',
	None = 'None',
}

export type TypedProvisionCacheInfo<T extends SandBoxCacheType = SandBoxCacheType> = T extends SandBoxCacheType.Code
	? CodeProvisionCacheInfo
	: T extends SandBoxCacheType.Flow
	? FlowProvisionCacheInfo
	: T extends SandBoxCacheType.None
	? NoneProvisionCacheInfo
	: T extends SandBoxCacheType.Connector
	? ConnectorProvisionCacheInfo
	: never

export type ProvisionCacheInfo = TypedProvisionCacheInfo

export const extractProvisionCacheKey = (params: ProvisionCacheInfo): string => {
	switch (params.type) {
		case SandBoxCacheType.Code:
			return extractCodeCacheKey(params)
		case SandBoxCacheType.Flow:
			return extractFlowCacheKey(params)
		case SandBoxCacheType.None:
			return extractNoneCacheKey(params)
		case SandBoxCacheType.Connector:
			return extractPieceCacheKey(params)
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

const extractPieceCacheKey = ({ connectorName, connectorVersion }: ConnectorProvisionCacheInfo): string => {
	return `CONNECOR-connectorName-${connectorName}-connectorVersion-${connectorVersion}`
}

type BaseProvisionCacheInfo<T extends SandBoxCacheType> = {
	type: T
}

type CodeProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.Code> & {
	sourceCodeHash: string
}

type FlowProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.Flow> & {
	flowVersionId: Id
}

type NoneProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.None>

type ConnectorProvisionCacheInfo = BaseProvisionCacheInfo<SandBoxCacheType.Connector> & {
	connectorName: string
	connectorVersion: string
}
