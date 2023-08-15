'use client'

import { CreateStrategyBuyForm } from '../../components/CreateStrategyBuyForm'
import { StrategyBuy } from '../../components/StrategyBuy'
import { CustomNodeProps, IStrategyBuyNode } from '../types'
import { useStrategy } from '../../../strategies/useStrategy'
import { useEffect } from 'react'
import { StrategyBuyType } from '@market-connector/types'

type StrategyBuyNodeProps = CustomNodeProps<IStrategyBuyNode>

export function StrategyBuyNode({ data: { strategyBuy, strategyId }, id }: StrategyBuyNodeProps) {
  const {
    createStrategyBuyForm,
    onSubmitStrategyBuyCreate,
    patchStrategyBuyForm,
    onSubmitStrategyBuyPatch,
    isLoading,
  } = useStrategy({
    strategyId: strategyId,
  })

  useEffect(() => {
    strategyBuy?.id
      ? patchStrategyBuyForm.reset({
          active: strategyBuy.active,
          conditionMarketProvider: strategyBuy.strategyBuy?.conditionMarketProvider,
          conditions: strategyBuy.strategyBuy.conditions,
          name: strategyBuy.strategyBuy.name,
          triggeredTimes: strategyBuy.strategyBuy.triggeredTimes,
          type: strategyBuy.strategyBuy.type,
          validityUnix: strategyBuy.strategyBuy.validityUnix,
        })
      : createStrategyBuyForm.reset({
          active: true,
          conditions: [],
          name: 'My fast strategy buy',
          type: StrategyBuyType.StrategyBuyStaticMarket,
        })
  }, [])

  return strategyBuy?.id ? (
    <StrategyBuy
      nodeId={id}
      form={patchStrategyBuyForm}
      onSubmit={onSubmitStrategyBuyPatch}
      isLoading={isLoading}
      strategyBuy={strategyBuy}
    />
  ) : (
    <CreateStrategyBuyForm
      nodeId={id}
      form={createStrategyBuyForm}
      onSubmit={onSubmitStrategyBuyCreate}
      isLoading={isLoading}
      baseStrategyBuy={strategyBuy?.strategyBuy}
    />
  )
}
