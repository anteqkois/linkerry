import { IStrategy, IStrategyBuy } from '@market-connector/types'
import { Node } from 'reactflow'

export interface ICustomNode<I extends CustomNodeId, D> extends Node<D, I> {
  id: `${I}${`_${number}` | ''}`
}
export interface IAddStrategyBuyNode extends ICustomNode<'AddStrategyBuyNode', { parentId: string }> {}
export interface IStrategyNode extends ICustomNode<'StrategyNode', { strategy: IStrategy }> {}
export interface IStrategyBuyNode extends ICustomNode<'StrategyBuyNode', { strategyBuy: Partial<IStrategyBuy> }> {}


export type CustomNode = IStrategyNode | IStrategyBuyNode | IAddStrategyBuyNode
export type CustomNodeType = NonNullable<CustomNode['type']>
export type CustomNodeId = CustomNode['id']
