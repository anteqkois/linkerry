'use client'

import { useStrategyBuy } from '../../../strategies/useStrategyBuy'
import { CreateStrategyBuyForm } from '../../components/CreateStrategyBuyForm'
import { StrategyBuy } from '../../components/StrategyBuy'
import { CustomNodeProps, IStrategyBuyNode } from '../types'
import { useStrategy } from '../../../strategies/useStrategy'

type StrategyBuyNodeProps = CustomNodeProps<IStrategyBuyNode>

export function StrategyBuyNode({ data, id }: StrategyBuyNodeProps) {
  const { updateForm, onSubmitUpdate, isLoading } = useStrategyBuy({
    strategyBuy: data.strategyBuy,
  })
  const { patchForm, onSubmitPatch } = useStrategy({ strategy: { _id: data.strategyId } })

  return data.strategyBuy?._id ? (
    <StrategyBuy
      nodeId={id}
      form={updateForm}
      onSubmit={onSubmitUpdate}
      isLoading={isLoading}
      strategyBuy={data.strategyBuy}
    />
  ) : (
    <CreateStrategyBuyForm
      nodeId={id}
      form={patchForm}
      onSubmit={onSubmitPatch}
      isLoading={isLoading}
      baseStrategyBuy={data.strategyBuy}
    />
  )
}
