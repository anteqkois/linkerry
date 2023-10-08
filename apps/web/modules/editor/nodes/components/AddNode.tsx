'use client'

import { Button, Icons } from '@market-connector/ui-components/server'
import { Handle, Position } from 'reactflow'
import { AddNodeProps, CustomNodeProps } from '../types'

type AddNodeProps = CustomNodeProps<AddNodeProps>

export function AddNode({ data: { parentNodeId, text }, id, xPos, yPos }: AddNodeProps) {
  // const { addNode, getNodeById, deleteNode, updateEdge } = useEditor()

  // const addStrategyBuyNode = () => {
  //   const parentNode = getNodeById(parentNodeId)
  //   if (!parentNode) throw new Error('Missing parent node')

  //   let newNode: CustomNode
  //   switch (variant) {
  //     case CustomNodeType.StrategyBuyNode:
  //       newNode = strategyBuyNodeFactory({
  //         parentNode: parentNodeId,
  //         x: parentNode.position.x + nodeConfigs.StrategyNode.width / 2 + nodeConfigs.gap.x,
  //         // x: xPos,
  //         y: yPos,
  //         // y: (parentNode.height ?? 0) + nodeConfigs.gap.y,
  //       })
  //       break
  //     case CustomNodeType.ConditionNode:
  //       newNode = conditionNodeFactory({
  //         parentNode: parentNodeId,
  //         x: parentNode.position.x + nodeConfigs.StrategyNode.width / 2 + nodeConfigs.gap.x,
  //         // x: xPos,
  //         y: yPos,
  //         // y: (parentNode.height ?? 0) + nodeConfigs.gap.y,
  //       })
  //       break

  //     default:
  //       throw new Error(`Unhandlet add button variant: ${variant}`)
  //   }
  //   addNode(newNode)
  //   deleteNode(id)

  //   updateEdge(`${parentNode.id}-${id}`, { id: `${parentNode.id}-${newNode.id}`, target: newNode.id })
  // }

  const addAction = () => {
    //
  }

  return (
    <Button className="gap-1 text-strategy-buy border-strategy-buy/50" variant={'outline'} onClick={addAction}>
      <Handle type="target" position={Position.Top} isConnectableStart={false} className='h-2 w-8 border-none rounded-sm !bg-strategy-buy' />
      <Icons.plus /> {text}
    </Button>
  )
}
