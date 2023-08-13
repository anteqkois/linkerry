'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  IStrategy,
  IStrategy_CreateResponse,
  IStrategy_PatchInput,
  IStrategy_UpdateResponse,
  Id,
  StrategyType,
} from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyApi } from './api'
import { StrategyStaticMarketCreateSchema, StrategyStaticMarketUpdateSchema } from './validations'

const createStrategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: StrategyStaticMarketCreateSchema,
  [StrategyType.StrategyDynamicMarket]: StrategyStaticMarketCreateSchema,
}

const updateStrategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: StrategyStaticMarketUpdateSchema,
  [StrategyType.StrategyDynamicMarket]: StrategyStaticMarketUpdateSchema,
}

interface useStrategyProps {
  idToFetch?: Id
  strategy?: IStrategy
}

export const useStrategy = ({ idToFetch, strategy }: useStrategyProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const { push } = useRouter()

  // useEffect(() => {
  //   ;(() => {
  //     // Strategy data passed from cache (local storage etc)
  //     if (strategy) {
  //     }
  //   })()
  // }, [])

  const createForm = useForm<z.infer<typeof StrategyStaticMarketCreateSchema>>({
    resolver: async (data, context, options) =>
      zodResolver(createStrategyResloverGateway[data.type])(data, context, options),
    defaultValues: {
      type: StrategyType.StrategyStaticMarket,
      name: '',
      strategyBuy: [],
      active: true,
      testMode: false,
    },
  })

  const onSubmitCreate = async (values: z.infer<typeof StrategyStaticMarketCreateSchema>) => {
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
      push(`${pathname}/${response._id}`)
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

  const updateForm = useForm<z.infer<typeof StrategyStaticMarketUpdateSchema>>({
    resolver: async (data, context, options) =>
      zodResolver(updateStrategyResloverGateway[data.type])(data, context, options),
    defaultValues: strategy,
  })

  const onSubmitUpdate = async (values: z.infer<typeof StrategyStaticMarketUpdateSchema>) => {
    setIsLoading(true)
    try {
      if (!strategy?._id) throw new Error('Missing strategy id')
      const res = await StrategyApi.update(strategy?._id, values)
      setIsLoading(false)
      // toast({
      //   title: 'Strategy saved',
      //   description: `Your strategy has been saved, it is running in test ${values.testMode ? 'test' : 'live'} mode`,
      //   duration: 6000,
      //   variant: 'success',
      // })
      return res.data
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError)
        toast({
          title: "Strategy didn't saved",
          description: serverError ? serverError.message : 'Saving strategy failed. Please try again.',
          duration: 6000,
          variant: 'destructive',
        })
    }
  }

  const patchStrategy = async (input: IStrategy_PatchInput) => {
    if (!strategy?._id) throw new Error('Missing strategy id')
    const res = await StrategyApi.patch(strategy?._id, input)
    return res.data
  }

  return {
    isLoading,
    setIsLoading,
    createForm,
    onSubmitCreate,
    updateForm,
    onSubmitUpdate,
    patchStrategy,
  }
}
