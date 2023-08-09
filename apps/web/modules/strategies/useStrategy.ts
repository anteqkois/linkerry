'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  StrategyType,
} from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyApi } from './api'
import { strategyStaticMarketSchema } from './validations'


export const useStrategy = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createForm = useForm<z.infer<typeof strategyStaticMarketSchema>>({
    resolver: zodResolver(strategyStaticMarketSchema),
    defaultValues: {
      type: StrategyType.StrategyStaticMarkets,
      name: '',
      strategyBuy:[]
    },
  })

  const onSubmitCreate = async (values: z.infer<typeof strategyStaticMarketSchema>) => {
    console.log(values)
    setIsLoading(true)
    try {
      const res = await StrategyApi.createStatic(values)
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError)
        return toast({
          title: "Strategy didn't saved",
          description: serverError ? serverError.message : 'Saving strategy failed. Please try again.',
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
  }
}
