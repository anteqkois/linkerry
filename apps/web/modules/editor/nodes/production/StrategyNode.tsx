'use client'

import { NodeProps } from 'reactflow'
import { useStrategy } from '../../../strategies/useStrategy'
import { StrategyForm } from '../demo/StrategyForm'

type Props = NodeProps

export function StrategyNode({ data, xPos, yPos }: Props) {
  const { createForm, isLoading, onSubmitCreate } = useStrategy()
  return <StrategyForm createForm={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
}
