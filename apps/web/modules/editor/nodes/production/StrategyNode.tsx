'use client'

import { useEffect } from 'react'
import { useStrategy } from '../../../strategies/useStrategy'
import { CreateStrategyForm, Strategy } from '../../components'
import { CustomNodeProps, IStrategyNode } from '../types'
import { IStrategyStrategyBuy, StrategyType } from '@market-connector/types'

type StrategyNodeProps = CustomNodeProps<IStrategyNode>

export function StrategyNode({ data: { strategy }, id }: StrategyNodeProps) {
  const { createForm, isLoading, onSubmitCreate, updateForm, onSubmitUpdate } = useStrategy({
    strategyId: strategy?._id,
  })

  useEffect(() => {
    const flattedStrategiesBuy: IStrategyStrategyBuy[] =
      strategy?.strategyBuy?.map((sb) => {
        if (typeof sb.strategyBuy === 'string') return sb as unknown as IStrategyStrategyBuy
        return {
          id: sb.id,
          active: sb.active,
          strategyBuy: sb.id,
        }
      }) ?? []

    strategy?._id
      ? updateForm.reset({
          active: strategy.active,
          name: strategy.name,
          testMode: strategy.testMode,
          type: strategy.type,
          strategyBuy: flattedStrategiesBuy,
          state: strategy.state,
          triggeredTimes: strategy.triggeredTimes,
          validityUnix: strategy.validityUnix,
        })
      : createForm.reset({
          active: strategy?.active ?? true,
          name: strategy?.name ?? 'My strategy',
          testMode: strategy?.testMode ?? false,
          type: strategy?.type ?? StrategyType.StrategyStaticMarket,
          strategyBuy: flattedStrategiesBuy,
        })
  }, [])

  return strategy ? (
    <Strategy form={updateForm} isLoading={isLoading} onSubmit={onSubmitUpdate} strategy={strategy} nodeId={id} />
  ) : (
    <CreateStrategyForm form={createForm} isLoading={isLoading} onSubmit={onSubmitCreate} />
  )
}
