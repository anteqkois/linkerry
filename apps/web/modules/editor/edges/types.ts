import { Edge, EdgeProps } from 'reactflow'
import { CustomNodeId } from '../nodes'

export type ICustomEdge<I extends string, D = undefined> = {
  type: `${I}Edge`
  id: `${CustomNodeId}-${CustomNodeId}`
} & Edge<D>

export type IDefaultEdge = ICustomEdge<'Default'>

export type CustomEdge = IDefaultEdge
export type CustomEdgeType = NonNullable<CustomEdge['type']>
export type CustomEdgeProps<N extends CustomEdge> = EdgeProps<N['data']> & { id: N['id'] }
export type CustomEdgeId = CustomEdge['id']
