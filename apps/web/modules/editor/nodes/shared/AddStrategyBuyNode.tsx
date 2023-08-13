'use client'

import { Button, Icons } from '@market-connector/ui-components/server'
import { Handle, Node, NodeProps, Position } from 'reactflow'

type AddStrategyBuyNodeProps = NodeProps<{ parentId: string }>

export function AddStrategyBuyNode({ data, xPos, yPos, sourcePosition, targetPosition }: AddStrategyBuyNodeProps) {
  // const { addNode, la } = useEditor()

  const addStrategyBuyNode = () => {
    // addNode({
    //   id:`strategyBuy`
    // })
  }

  // console.log(getNodeById(data.parentId));
  return (
    <Button className="gap-1 text-strategy-buy border-strategy-buy/50" variant={'outline'} onClick={addStrategyBuyNode}>
      <Icons.plus />
      Buy Strategy <Handle type="target" position={Position.Top} />
    </Button>
  )
}
