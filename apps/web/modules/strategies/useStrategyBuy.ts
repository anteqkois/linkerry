'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  StrategyBuyType,
} from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyBuyApi } from './api'
import { strategyBuyStaticMarketSchema } from './validations'


export const useStrategyBuy = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof strategyBuyStaticMarketSchema>>({
    resolver: zodResolver(strategyBuyStaticMarketSchema),
    defaultValues: {
      type: StrategyBuyType.StrategyBuyStaticMarket,
      name: '',
      conditions: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof strategyBuyStaticMarketSchema>) => {
    console.log(values)
    setIsLoading(true)
    try {
      const res = await StrategyBuyApi.createStatic(values)
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError)
        return toast({
          title: "Strategy didn't saved",
          description: serverError ? serverError.message : 'Saving strategy buy failed. Please try again.',
          duration: 6000,
          variant: 'destructive',
        })
    }
  }

  return {
    isLoading,
    setIsLoading,
    form,
    onSubmit,
  }
}
