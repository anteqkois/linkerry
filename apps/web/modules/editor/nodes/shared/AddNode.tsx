'use client'

import { Button, Icons } from '@market-connector/ui-components/server'
import { Handle, Position } from 'reactflow'
import { useEditor } from '../../useEditor'
import { CustomNode, CustomNodeProps, CustomNodeType, IAddNode } from '../types'
import { conditionNodeFactory, nodeConfigs, strategyBuyNodeFactory } from './nodeFactory'
import { cva } from 'class-variance-authority'
import { cn } from '@market-connector/ui-components/utils'

const addButtonVariants = cva('gap-1', {
  variants: {
    variant: {
      AddNode: '',
      StrategyBuyNode: 'text-strategy-buy border-strategy-buy/50',
      StrategyNode: '',
      ConditionNode: 'text-condition border-condition/50',
    } as Record<CustomNodeType, string>,
  },
  defaultVariants: {
    variant: CustomNodeType.AddNode,
  },
})

const addButtonHandleVariants = cva('h-2 w-8 border-none rounded-sm', {
  variants: {
    variant: {
      AddNode: '',
      StrategyBuyNode: '!bg-strategy-buy',
      StrategyNode: '',
      ConditionNode: '!bg-condition',
    } as Record<CustomNodeType, string>,
  },
  defaultVariants: {
    variant: CustomNodeType.AddNode,
  },
})

type AddNodeProps = CustomNodeProps<IAddNode>

export function AddNode({ data: { parentNodeId, variant, text }, id, xPos, yPos }: AddNodeProps) {
  const { addNode, getNodeById, deleteNode, updateEdge } = useEditor()

  const addStrategyBuyNode = () => {
    const parentNode = getNodeById(parentNodeId)
    if (!parentNode) throw new Error('Missing parent node')

    let newNode: CustomNode
    switch (variant) {
      case CustomNodeType.StrategyBuyNode:
        newNode = strategyBuyNodeFactory({
          parentNode: parentNodeId,
          x: parentNode.position.x + nodeConfigs.StrategyNode.width / 2 + nodeConfigs.gap.x,
          // x: xPos,
          y: yPos,
          // y: (parentNode.height ?? 0) + nodeConfigs.gap.y,
        })
        break
      case CustomNodeType.ConditionNode:
        newNode = conditionNodeFactory({
          parentNode: parentNodeId,
          x: parentNode.position.x + nodeConfigs.StrategyNode.width / 2 + nodeConfigs.gap.x,
          // x: xPos,
          y: yPos,
          // y: (parentNode.height ?? 0) + nodeConfigs.gap.y,
        })
        break

      default:
        throw new Error(`Unhandlet add button variant: ${variant}`)
    }
    addNode(newNode)
    deleteNode(id)

    updateEdge(`${parentNode.id}-${id}`, { id: `${parentNode.id}-${newNode.id}`, target: newNode.id })
  }

  return (
    <Button className={cn(addButtonVariants({ variant }))} variant={'outline'} onClick={addStrategyBuyNode}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectableStart={false}
        className={cn(addButtonHandleVariants({ variant }))}
      />
      <Icons.plus /> {text}
    </Button>
  )
}
