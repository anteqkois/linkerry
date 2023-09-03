'use client'

import { StrategyBuyType } from '@market-connector/types'
import { useEffect } from 'react'
import { Handle, Position } from 'reactflow'
import { useStrategy } from '../../../strategies/useStrategy'
import { CreateStrategyBuyForm } from '../../components/CreateStrategyBuyForm'
import { StrategyBuy } from '../../components/StrategyBuy'
import { useEditor } from '../../useEditor'
import { CustomNodeProps, IStrategyBuyNode } from '../types'

type StrategyBuyNodeProps = CustomNodeProps<IStrategyBuyNode>

export function StrategyBuyNode({ data: { strategyBuy }, id }: StrategyBuyNodeProps) {
  const { strategyId } = useEditor()
  const {
    createStrategyBuyForm,
    onSubmitStrategyBuyCreate,
    patchStrategyBuyForm,
    onSubmitStrategyBuyPatch,
    isLoading,
  } = useStrategy({ strategyId })

  useEffect(() => {
    strategyBuy?.id
      ? patchStrategyBuyForm.reset({
          strategyBuyId: strategyBuy.id,
          active: strategyBuy.active,
          conditionMarketProvider: strategyBuy.strategyBuy?.conditionMarketProvider,
          conditions: strategyBuy.strategyBuy.conditions,
          name: strategyBuy.strategyBuy.name,
          triggeredTimes: strategyBuy.strategyBuy.triggeredTimes,
          type: strategyBuy.strategyBuy.type,
          validityUnix: strategyBuy.strategyBuy.validityUnix,
        })
      : createStrategyBuyForm.reset({
          active: strategyBuy?.active ?? true,
          conditions: strategyBuy?.strategyBuy?.conditions ?? [],
          name: strategyBuy?.strategyBuy?.name ?? '',
          type: StrategyBuyType.StrategyBuyStaticMarket ?? StrategyBuyType.StrategyBuyStaticMarket,
        })
  }, [])

  return (
    <>
      <Handle type="target" position={Position.Top} className="h-2 w-8 border-none rounded-sm !bg-strategy-buy" />
      {strategyBuy?.id ? (
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
          parentNodeId={lastNodeId.StrategyNode as IStrategyBuyNode['id']}
        />
      )}
    </>
  )
}
