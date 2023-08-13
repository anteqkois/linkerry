'use client'

import { IStrategyBuy, IStrategyBuy_CreateResponse, IStrategyBuy_UpdateResponse } from '@market-connector/types'
import { useCallback } from 'react'
import { NodeProps } from 'reactflow'
import { useStrategyBuy } from '../../../strategies/useStrategyBuy'
import { CreateStrategyBuyForm } from '../../components/CreateStrategyBuyForm'
import { StrategyBuy } from '../../components/StrategyBuy'
import { useEditor } from '../../useEditor'
import { CustomNodeId } from '../types'

type StrategyBuyNodeProps = NodeProps<{ strategyBuy: Partial<IStrategyBuy> }> & { id: CustomNodeId }

export function StrategyBuyNode({ data, id }: StrategyBuyNodeProps) {
  const { createForm, updateForm, onSubmitUpdate, isLoading } = useStrategyBuy({
    strategyBuy: data.strategyBuy,
  })
  const { updateNode } = useEditor()
  // const { patchStrtaegy } = useStrategy()

  const updateStrategyBuyNode = useCallback(
    (newStrategyBuy?: IStrategyBuy_CreateResponse | IStrategyBuy_UpdateResponse) => {
      // Update React Flow
      newStrategyBuy &&
        updateNode(id, {
          id: `StrategyBuy_${newStrategyBuy?._id}`,
          data: {
            strategyBuy: {
              ...newStrategyBuy,
            },
          },
        })
    },
    [],
  )

  return data.strategyBuy?._id ? (
    <StrategyBuy
      form={updateForm}
      onSubmit={async (values: any) => {
        updateStrategyBuyNode(await onSubmitUpdate(values))
      }}
      isLoading={isLoading}
      strategyBuy={data.strategyBuy}
    />
  ) : (
    <CreateStrategyBuyForm
      form={createForm}
      onSubmit={async (values: any) => {
        console.log(values);
        // updateStrategyBuyNode(await onSubmitCreate(values))
      }}
      isLoading={isLoading}
      baseStrategyBuy={data.strategyBuy}
    />
  )
}
