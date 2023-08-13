'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { IStrategyBuy, StrategyBuyType, ValueOf } from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyBuyApi } from './api'
import {
  StrategyBuyCreateStaticMarketSchema,
  StrategyBuyUpdateStaticMarketSchema as StrategyBuyUpdateSchema,
} from './validations'

const createResloverSchemaGateway = {
  [StrategyBuyType.StrategyBuyStaticMarket]: StrategyBuyCreateStaticMarketSchema,
  [StrategyBuyType.StrategyBuyDynamicMarket]: StrategyBuyCreateStaticMarketSchema,
}

// const updateResloverSchemaGateway = {
//   [StrategyBuyType.StrategyBuyStaticMarket]: StrategyBuyUpdateSchema,
//   [StrategyBuyType.StrategyBuyDynamicMarket]: StrategyBuyUpdateSchema,
// }

interface useStrategyBuyProps {
  strategyBuy: Partial<IStrategyBuy>
}

export const useStrategyBuy = ({ strategyBuy }: useStrategyBuyProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const createForm = useForm<z.infer<ValueOf<typeof createResloverSchemaGateway>>>({
    resolver: async (data, context, options) =>
      zodResolver(createResloverSchemaGateway[data.type])(data, context, options),
    defaultValues: {
      type: strategyBuy?.type ?? StrategyBuyType.StrategyBuyStaticMarket,
      name: strategyBuy?.name ?? '',
      conditions: strategyBuy?.conditions ?? [],
    },
  })

  const onSubmitCreate = async (values: z.infer<ValueOf<typeof createResloverSchemaGateway>>) => {
    setIsLoading(true)
    try {
      const res = await StrategyBuyApi.createStatic(values)
      return res.data
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError)
        toast({
          title: "Strategy buy didn't saved",
          description: serverError ? serverError.message : 'Saving strategy buy buy failed. Please try again.',
          duration: 6000,
          variant: 'destructive',
        })
    }
  }

  const updateForm = useForm<z.infer<typeof StrategyBuyUpdateSchema>>({
    resolver: zodResolver(StrategyBuyUpdateSchema),
    defaultValues: {
      type: strategyBuy?.type ?? StrategyBuyType.StrategyBuyStaticMarket,
      name: strategyBuy?.name ?? '',
      conditions: strategyBuy?.conditions ?? [],
      triggeredTimes: strategyBuy?.triggeredTimes,
      validityUnix: strategyBuy?.validityUnix,
      conditionMarketProvider: strategyBuy?.conditionMarketProvider,
    },
  })

  const onSubmitUpdate = async (values: z.infer<typeof StrategyBuyUpdateSchema>) => {
    setIsLoading(true)
    try {
      if (!strategyBuy?._id) throw Error('Missings strategy buy Id')
      const res = await StrategyBuyApi.update(strategyBuy._id, values)
      return res.data
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError)
        toast({
          title: "Strategy buy didn't saved",
          description: serverError ? serverError.message : 'Saving strategy buy buy failed. Please try again.',
          duration: 6000,
          variant: 'destructive',
        })
    }
  }

  return {
    isLoading,
    setIsLoading,
    createForm,
    onSubmitCreate,
    updateForm,
    onSubmitUpdate,
  }
}
