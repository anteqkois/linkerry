'use client'

import { useStrategy } from '../../../strategies/useStrategy'
import { CreateStrategyForm, Strategy } from '../../components'
import { CustomNodeProps, IStrategyNode } from '../types'

type StrategyNodeProps = CustomNodeProps<IStrategyNode>

export function StrategyNode({ data, id }: StrategyNodeProps) {
  const { createForm, isLoading, onSubmitCreate, updateForm, onSubmitUpdate } = useStrategy({ strategy: data.strategy })

  return data.strategy ? (
    <Strategy form={updateForm} isLoading={isLoading} onSubmit={onSubmitUpdate} strategy={data.strategy} nodeId={id} />
  ) : (
    <CreateStrategyForm form={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
  )
}
