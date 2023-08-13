'use client'

import { IStrategy } from '@market-connector/types'
import { useStrategy } from '../../../strategies/useStrategy'
import { CreateStrategyForm, Strategy } from '../../components'
import { CustomNodeProps } from '../types'

type StrategyNodeProps = CustomNodeProps<{ strategy?: IStrategy }>

export function StrategyNode({ data, xPos, yPos, id }: StrategyNodeProps) {
  const { createForm, isLoading, onSubmitCreate, updateForm, onSubmitUpdate } = useStrategy({ strategy: data.strategy })

  return data.strategy ? (
    <Strategy form={updateForm} isLoading={isLoading} onSubmit={onSubmitUpdate} strategy={data.strategy} nodeId={id} />
  ) : (
    <CreateStrategyForm form={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
  )
}
