'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Id, StrategyBuyType, StrategyType, ValueOf } from '@market-connector/types'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { StrategyApi } from './api'
import {
  IStrategy_PatchSchema,
  IStrategy_StrategyBuyCreateSchema,
  IStrategy_StrategyBuyPatchSchema,
  Strategy_PatchSchema,
  Strategy_StaticMarketCreateSchema,
  Strategy_StaticMarketUpdateSchema,
  Strategy_StrategyBuyCreateSchema,
  Strategy_StrategyBuyPatchSchema,
} from './validations'

const createStrategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: Strategy_StaticMarketCreateSchema,
  [StrategyType.StrategyDynamicMarket]: Strategy_StaticMarketCreateSchema,
}

const updateStrategyResloverGateway = {
  [StrategyType.StrategyStaticMarket]: Strategy_StaticMarketUpdateSchema,
  [StrategyType.StrategyDynamicMarket]: Strategy_StaticMarketUpdateSchema,
}

interface useStrategyProps {
  strategyId?: Id
}

export const useStrategy = ({ strategyId }: useStrategyProps) => {
  const [isLoading, setIsLoading] = useState(false)

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
      const { data } = await StrategyApi.create(values)
      // toast({
      //   title: 'Strategy created',
      //   description: `Your strategy has been created. You can now add sub-strategies to it, such as 'Buying Strategies'.`,
      //   duration: 6000,
      //   variant: 'success',
      // })
      setIsLoading(false)
      return data
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

  const updateForm = useForm<z.infer<ValueOf<typeof updateStrategyResloverGateway>>>({
    resolver: async (data, context, options) =>
      zodResolver(updateStrategyResloverGateway[data.type])(data, context, options),
  })

  const onSubmitUpdate = async (values: z.infer<ValueOf<typeof updateStrategyResloverGateway>>) => {
    setIsLoading(true)
    try {
      if (!strategyId) throw new Error('Missing strategy id')
      const res = await StrategyApi.update(strategyId, values)
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

  const patchForm = useForm<IStrategy_PatchSchema>({
    resolver: zodResolver(Strategy_PatchSchema),
    // defaultValues: strategy,
  })

  const onSubmitPatch = async (values: IStrategy_PatchSchema) => {
    setIsLoading(true)
    try {
      if (!strategyId) throw new Error('Missing strategy id')
      const res = await StrategyApi.patch(strategyId, values)
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

  const patchStrategyBuyForm = useForm<IStrategy_StrategyBuyPatchSchema>({
    resolver: zodResolver(Strategy_StrategyBuyPatchSchema),
  })

  const onSubmitStrategyBuyPatch = async (values: IStrategy_StrategyBuyPatchSchema) => {
    setIsLoading(true)
    try {
      if (!strategyId) throw new Error('Missing strategy id or strategy buy id')
      const res = await StrategyApi.patchStrategyBuy(strategyId, values.strategyBuyId, values)
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

  const createStrategyBuyForm = useForm<IStrategy_StrategyBuyCreateSchema>({
    resolver: zodResolver(Strategy_StrategyBuyCreateSchema),
    defaultValues: {
      active: true,
      conditions: [],
      name: '',
      type: StrategyBuyType.StrategyBuyStaticMarket,
    },
  })

  const onSubmitStrategyBuyCreate = async (values: IStrategy_StrategyBuyCreateSchema) => {
    setIsLoading(true)
    try {
      if (!strategyId) throw new Error('Missing strategy id')
      const res = await StrategyApi.createStrategyBuy(strategyId, values)

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
    onSubmitPatch,
    patchStrategyBuyForm,
    onSubmitStrategyBuyPatch,
    createStrategyBuyForm,
    onSubmitStrategyBuyCreate,
  }
}
