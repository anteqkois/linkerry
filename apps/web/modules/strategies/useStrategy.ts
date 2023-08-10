'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { IStrategy_CreateResponse, StrategyType } from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyStaticMarketchema } from './validations'
import { StrategyApi } from './api'
import { useRouter } from 'next/navigation'

const strategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: StrategyStaticMarketchema,
  [StrategyType.StrategyDynamicMarket]: StrategyStaticMarketchema,
}

export const useStrategy = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()

  const createForm = useForm<z.infer<typeof StrategyStaticMarketchema>>({
    resolver: async (data, context, options) => zodResolver(strategyResloverGateway[data.type])(data, context, options),
    defaultValues: {
      type: StrategyType.StrategyStaticMarket,
      name: '',
      strategyBuy: [],
      active: true,
      testMode: false,
    },
  })

  const onSubmitCreate = async (values: z.infer<typeof StrategyStaticMarketchema>) => {
    setIsLoading(true)
    try {
      let response: IStrategy_CreateResponse
      switch (values.type) {
        case StrategyType.StrategyStaticMarket:
          response = (await StrategyApi.createStatic(values)).data
          break
        case StrategyType.StrategyDynamicMarket:
          response = (await StrategyApi.createStatic(values)).data
          break
      }
      toast({
        title: 'Strategy created',
        description: `Your strategy has been created. You can now add sub-strategies to it, such as 'Buying Strategies'.`,
        duration: 6000,
        variant: 'success',
      })
      push(response._id)
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
