'use client'

import { NodeProps } from 'reactflow'
import { useStrategy } from '../../../strategies/useStrategy'
import { CreateStrategyForm, UpdateStrategyForm } from '../../components'
import { IStrategy } from '@market-connector/types'

type StrategyNodeProps = NodeProps<{ strategy?: IStrategy }>

export function StrategyNode({ data, xPos, yPos }: StrategyNodeProps) {
  const { createForm, isLoading, onSubmitCreate, updateForm, onSubmitUpdate } = useStrategy({ strategy: data.strategy })
  return data.strategy ? (
    <UpdateStrategyForm form={updateForm} isLoading={isLoading} onSubmit={onSubmitUpdate} />
  ) : (
    <CreateStrategyForm form={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
  )
}
