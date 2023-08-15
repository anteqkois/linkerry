'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  IStrategy,
  StrategyType,
  ValueOf,
} from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyApi } from './api'
import { StrategyPatchSchema, StrategyStaticMarketCreateSchema, StrategyStaticMarketUpdateSchema } from './validations'

const createStrategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: StrategyStaticMarketCreateSchema,
  [StrategyType.StrategyDynamicMarket]: StrategyStaticMarketCreateSchema,
}

const updateStrategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: StrategyStaticMarketUpdateSchema,
  [StrategyType.StrategyDynamicMarket]: StrategyStaticMarketUpdateSchema,
}

interface useStrategyProps {
  strategy?: Partial<IStrategy>
}

export const useStrategy = ({ strategy }: useStrategyProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const { push } = useRouter()

  // const strategyBlank: IStrategy = useMemo(() => {
  //   const strategyBuy = strategy?.strategyBuy?.map((strategy) => {
  //     if (typeof strategy.id === 'string') return strategy
  //     return {
  //       id: strategy.id,
  //       active: strategy.active,
  //       strategyBuy: strategy.id,
  //     } as IStrategyStrategyBuy
  //   })
  //   return { ...strategy, strategyBuy } as IStrategy
  // }, [strategy])

  const createForm = useForm<z.infer<ValueOf<typeof createStrategyResloverGateway>>>({
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

  const onSubmitCreate = async (values: z.infer<ValueOf<typeof createStrategyResloverGateway>>) => {
    setIsLoading(true)
    try {
      const response = await StrategyApi.create(values)
      toast({
        title: 'Strategy created',
        description: `Your strategy has been created. You can now add sub-strategies to it, such as 'Buying Strategies'.`,
        duration: 6000,
        variant: 'success',
      })
      push(`${pathname}/${response.data._id}`)
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

  const updateForm = useForm<z.infer<ValueOf<typeof updateStrategyResloverGateway>>>({
    resolver: async (data, context, options) =>
      zodResolver(updateStrategyResloverGateway[data.type])(data, context, options),
    defaultValues: strategy,
  })

  const onSubmitUpdate = async (values: z.infer<ValueOf<typeof updateStrategyResloverGateway>>) => {
    setIsLoading(true)
    try {
      if (!strategy?._id) throw new Error('Missing strategy id')
      const res = await StrategyApi.update(strategy?._id, values)
      setIsLoading(false)
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

  const patchForm = useForm<z.infer<typeof StrategyPatchSchema>>({
    resolver: zodResolver(StrategyPatchSchema),
    defaultValues: strategy,
  })

  const onSubmitPatch = async (values: z.infer<typeof StrategyPatchSchema>) => {
    setIsLoading(true)
    try {
      if (!strategy?._id) throw new Error('Missing strategy id')
      const res = await StrategyApi.patch(strategy?._id, values)
      setIsLoading(false)
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

  return {
    isLoading,
    setIsLoading,
    createForm,
    onSubmitCreate,
    updateForm,
    onSubmitUpdate,
    patchForm,
    onSubmitPatch
  }
}
