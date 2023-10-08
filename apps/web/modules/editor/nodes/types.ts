import { Trigger } from '@market-connector/shared';
// import { Id } from '@market-connector/shared'
import { Node, NodeProps } from 'reactflow';

export interface ICustomNode<T extends string, D> extends Node<D, `${T}Node`> {
  // id: `${I}_${`${string}` | `temp`}`
  id: `${T}_${`${string}`}`
}
export interface AddNodeProps extends ICustomNode<'Add', { parentNodeId: CustomNodeId; text: string; variant: CustomNodeType }> {}
export interface TriggerNodeProps extends ICustomNode<'Trigger', { trigger: Trigger }> {}
// export interface IStrategyBuyNode extends ICustomNode<'StrategyBuy', { strategyBuy?: IStrategy_StrategyBuyExpanded }> {}

export type CustomNode = TriggerNodeProps | AddNodeProps
// export type CustomNodeType = NonNullable<CustomNode['type']>

export enum CustomNodeType {
  AddNode = 'AddNode',
  TriggerNode = 'TriggerNode',
}
export type CustomNodeProps<N extends CustomNode> = NodeProps<N['data']> & { id: N['id'] }
export type CustomNodeId = CustomNode['id']
