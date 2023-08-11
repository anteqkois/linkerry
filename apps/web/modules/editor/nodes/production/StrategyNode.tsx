'use client'

import { NodeProps } from 'reactflow'
import { useStrategy } from '../../../strategies/useStrategy'
import { CreateStrategyForm, UpdateStrategyForm } from '../../components'
import { IStrategy } from '@market-connector/types'

export type StrategyNodeProps = NodeProps<{ strategy?: IStrategy }>

export function StrategyNode({ data, xPos, yPos }: StrategyNodeProps) {
  const { createForm, isLoading, onSubmitCreate, updateForm, onSubmitUpdate } = useStrategy({ strategy: data.strategy })
  return data.strategy ? (
    <UpdateStrategyForm form={updateForm} isLoading={isLoading} onSubmit={onSubmitUpdate} />
  ) : (
    <CreateStrategyForm form={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
  )

  // return <CreateStrategyForm form={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
  // return (
  // <div className="outline outline-offset-4 outline-[1px] outline-strategy-buy/40 rounded-md w-full h-full">
  // <UpdateStrategyForm
  //   // className="absolute -top-full"
  //   form={updateForm}
  //   isLoading={isLoading}
  //   onSubmit={onSubmitUpdate}
  // />
  // </div>
  // )
}
