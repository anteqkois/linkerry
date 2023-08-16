'use client'

import { Button, Icons } from '@market-connector/ui-components/server'
import { Handle, Position } from 'reactflow'
import { useEditor } from '../../useEditor'
import { CustomNodeProps, IAddStrategyBuyNode } from '../types'
import { nodeConfigs, strategyBuyNodeFactory } from './nodeFactory'

type AddStrategyBuyNodeProps = CustomNodeProps<IAddStrategyBuyNode>

export function AddStrategyBuyNode({ data: { parentNodeId }, id }: AddStrategyBuyNodeProps) {
  const { addNode, getNodeById, deleteNode, updateEdge } = useEditor()

  const addStrategyBuyNode = () => {
    const parentNode = getNodeById(parentNodeId)
    if (!parentNode) throw new Error('Missing parent node')

    const strategyBuyNode = strategyBuyNodeFactory({
      parentNode: parentNodeId,
      x: parentNode.position.x,
      y: (parentNode.height ?? 0) + nodeConfigs.gap.y,
    })
    addNode(strategyBuyNode)
    deleteNode(id)

    updateEdge(`${parentNode.id}-${id}`, { id: `${parentNode.id}-${strategyBuyNode.id}`, target: strategyBuyNode.id })
  }

  return (
    <Button className="gap-1 text-strategy-buy border-strategy-buy/50" variant={'outline'} onClick={addStrategyBuyNode}>
      <Handle type="target" position={Position.Top} />
      <Icons.plus /> Buy Strategy
    </Button>
  )
}
