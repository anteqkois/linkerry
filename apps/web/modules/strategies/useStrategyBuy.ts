'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Id, StrategyBuyType, ValueOf } from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyBuyApi } from './api'
import { StrategyBuy_CreateSchema, StrategyBuy_UpdateSchema } from './validations'

const createResloverSchemaGateway = {
  [StrategyBuyType.StrategyBuyStaticMarket]: StrategyBuy_CreateSchema,
  [StrategyBuyType.StrategyBuyDynamicMarket]: StrategyBuy_CreateSchema,
}

// const updateResloverSchemaGateway = {
//   [StrategyBuyType.StrategyBuyStaticMarket]: StrategyBuyUpdateSchema,
//   [StrategyBuyType.StrategyBuyDynamicMarket]: StrategyBuyUpdateSchema,
// }

interface useStrategyBuyProps {
  strategyBuyId?: Id
}

export const useStrategyBuy = ({ strategyBuyId }: useStrategyBuyProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const createForm = useForm<z.infer<ValueOf<typeof createResloverSchemaGateway>>>({
    resolver: async (data, context, options) =>
      zodResolver(createResloverSchemaGateway[data.type])(data, context, options),
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

  const updateForm = useForm<z.infer<typeof StrategyBuy_UpdateSchema>>({
    resolver: zodResolver(StrategyBuy_UpdateSchema),
  })

  const onSubmitUpdate = async (values: z.infer<typeof StrategyBuy_UpdateSchema>) => {
    setIsLoading(true)
    try {
      if (!strategyBuyId) throw Error('Missings strategy buy Id')
      const res = await StrategyBuyApi.update(strategyBuyId, values)
      setIsLoading(false)
      return res.data
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
