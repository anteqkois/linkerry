import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { Action, Trigger } from '@linkerry/shared'
import { NodeProps, Node as ReactFlowNode } from 'reactflow'

export interface ICustomNode<T extends string, D extends object = any> extends ReactFlowNode<D, `${T}Node`> {
	// id: `${T}_${`${string}`}`
	id: string
	height: number
	width: number
}

export interface SelectTriggerNodeProps extends ICustomNode<'SelectTrigger', { trigger: Trigger }> {}
export interface TriggerNodeProps extends ICustomNode<'Trigger', { trigger: Trigger; connectorMetadata: ConnectorMetadataSummary }> {}
export interface ActionNodeProps
	extends ICustomNode<'Action', { action: Action; connectorMetadata: ConnectorMetadataSummary; position: ReactFlowNode['position'] }> {}

export type CustomNode = TriggerNodeProps | SelectTriggerNodeProps | ActionNodeProps
// export type CustomNodeType = NonNullable<CustomNode['type']>

// todo change to uppercase
// export enum CustomNodeType {
//   SELECT_TRIGGER_NODE = 'SELECT_TRIGGER_NODE',
//   TRIGGER_NODE = 'TRIGGER_NODE',
//   SELECT_ACTION_NODE = 'SELECT_ACTION_NODE',
//   ACTION_NODE = 'ACTION_NODE',
// }
export enum CustomNodeType {
	SelectTriggerNode = 'SelectTriggerNode',
	TriggerNode = 'TriggerNode',
	ActionNode = 'ActionNode',
}

export type CustomNodeProps<N extends CustomNode> = NodeProps<N['data']> & { id: N['id'] }
export type CustomNodeId = CustomNode['id']
