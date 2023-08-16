'use client'

import { Button, Icons } from '@market-connector/ui-components/server'
import { Handle, Position } from 'reactflow'
import { CustomNodeProps, IAddStrategyBuyNode } from '../types'
import { useEditor } from '../../useEditor'
import { strategyBuyNodeFactory } from './nodeFactory'

type AddStrategyBuyNodeProps = CustomNodeProps<IAddStrategyBuyNode>

export function AddStrategyBuyNode({ data: { parentNodeId }, id }: AddStrategyBuyNodeProps) {
  const { addNode } = useEditor()

  const addStrategyBuyNode = () => {
    addNode(
      strategyBuyNodeFactory({
        strategyBuy: undefined,
        parentNode: parentNodeId,
      }),
    )
  }

  return (
    <Button className="gap-1 text-strategy-buy border-strategy-buy/50" variant={'outline'} onClick={addStrategyBuyNode}>
      <Icons.plus />
      Buy Strategy <Handle type="target" position={Position.Top} />
    </Button>
  )
}
