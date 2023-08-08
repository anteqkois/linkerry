import { NodeProps } from 'reactflow'

type Props = NodeProps

export function StrategyBuyNode({ data, xPos, yPos }: Props) {
  return (
    <div className="w-full h-full bg-background/60 borderd border-2 p-1 rounded-md">
      <div className='absolute -top-16'>Buy strategies</div>
    </div>
  )
}
