import { IStrategyExpand, IStrategy_StrategyBuyExpanded, Id } from '@market-connector/types';
import { Node, NodeProps } from 'reactflow';

export interface ICustomNode<I extends string, D> extends Node<D, `${I}Node`> {
  id: `${I}_${`${Id}` | `Temp`}`
}
export interface IAddStrategyBuyNode extends ICustomNode<'AddStrategyBuy', { parentNodeId: CustomNodeId }> {}
export interface IStrategyNode extends ICustomNode<'Strategy', { strategy?: IStrategyExpand<'strategyBuy.strategyBuy'> }> {}
export interface IStrategyBuyNode
  extends ICustomNode<'StrategyBuy', { strategyBuy?: IStrategy_StrategyBuyExpanded }> {}

export type CustomNode = IStrategyNode | IStrategyBuyNode | IAddStrategyBuyNode
export type CustomNodeType = NonNullable<CustomNode['type']>
export type CustomNodeProps<N extends CustomNode> = NodeProps<N['data']> & { id: N['id'] }
export type CustomNodeId = CustomNode['id']
