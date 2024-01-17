import { ConnectorMetadataSummary } from '@linkerry/connectors-framework';
import { Trigger } from '@linkerry/shared';
import { Node, NodeProps } from 'reactflow';

export interface ICustomNode<T extends string, D extends object = any> extends Node<D, `${T}Node`> {
  // id: `${T}_${`${string}`}`
  id: string
}

export interface SelectTriggerNodeProps extends ICustomNode<'SelectTrigger', { trigger: Trigger }> {}
export interface TriggerNodeProps extends ICustomNode<'Trigger', { trigger: Trigger; connectorMetadata: ConnectorMetadataSummary }> {}

export type CustomNode = TriggerNodeProps | SelectTriggerNodeProps
// export type CustomNodeType = NonNullable<CustomNode['type']>

export enum CustomNodeType {
  SelectTriggerNode = 'SelectTriggerNode',
  TriggerNode = 'TriggerNode',
}

export type CustomNodeProps<N extends CustomNode> = NodeProps<N['data']> & { id: N['id'] }
export type CustomNodeId = CustomNode['id']
