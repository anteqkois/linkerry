import { IStrategyExpand, IStrategy_StrategyBuyExpanded, Id } from '@market-connector/types';
import { Node, NodeProps } from 'reactflow';

export interface ICustomNode<I extends string, D> extends Node<D, `${I}Node`> {
  id: `${I}_${`${Id}` | `temp`}`
}
export interface IAddNode
  extends ICustomNode<'Add', { parentNodeId: CustomNodeId; text: string; variant: CustomNodeType }> {}
export interface IStrategyNode
  extends ICustomNode<'Strategy', { strategy?: IStrategyExpand<'strategyBuy.strategyBuy'> }> {}
export interface IStrategyBuyNode extends ICustomNode<'StrategyBuy', { strategyBuy?: IStrategy_StrategyBuyExpanded }> {}

export type CustomNode = IStrategyNode | IStrategyBuyNode | IAddNode
// export type CustomNodeType = NonNullable<CustomNode['type']>
export enum CustomNodeType {
  AddNode = 'AddNode',
  StrategyNode = 'StrategyNode',
  StrategyBuyNode = 'StrategyBuyNode',
  ConditionNode = 'ConditionNode',
}
export type CustomNodeProps<N extends CustomNode> = NodeProps<N['data']> & { id: N['id'] }
export type CustomNodeId = CustomNode['id']
