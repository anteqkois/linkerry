import { IStrategy, IStrategyBuy, Id } from '@market-connector/types'
import { Node } from 'reactflow'

export interface ICustomNode<I extends CustomNodeId, D> extends Node<D, `${I}Node`> {
  id: `${I}${`_${Id}`|`_Temp` | ''}`
}
export interface IAddStrategyBuyNode extends ICustomNode<'AddStrategyBuy', { parentId: string }> {}
export interface IStrategyNode extends ICustomNode<'Strategy', { strategy: Partial<IStrategy> }> {}
export interface IStrategyBuyNode extends ICustomNode<'StrategyBuy', { strategyBuy: Partial<IStrategyBuy> }> {}


export type CustomNode = IStrategyNode | IStrategyBuyNode | IAddStrategyBuyNode
export type CustomNodeType = NonNullable<CustomNode['type']>
export type CustomNodeId = CustomNode['id']
