import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@market-connector/ui-components/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { retriveServerHttpException } from '../../utils'
import { UserKeysApi } from './api'
import { userKeysSchema } from './validations'

export const useUserKeys = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createForm = useForm<z.infer<typeof userKeysSchema>>({
    resolver: zodResolver(userKeysSchema),
    defaultValues: {
      aKey: '',
      exchange: undefined,
      exchangeCode: undefined,
      name: '',
      sKey: '',
    },
  })

  const onSubmitCreate = async (values: z.infer<typeof userKeysSchema>) => {
    setIsLoading(true)
    try {
      const res = await UserKeysApi.create(values)

      createForm.setValue('aKey', `${res.data.aKeyInfo}...`)
      createForm.setValue('sKey', `${res.data.sKeyInfo}...`)

      setIsLoading(false)
      toast({
        title: 'Keys saved',
        description: `Your exchange keys are encrypted and saved. You can now use ${values.exchangeCode} exchange.`,
        duration: 6000,
        variant: 'success',
      })
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      console.log(error)
      if (serverError)
        return toast({
          title: "Keys didn't saved",
          description: serverError ? serverError.message : 'Saving keys failed. Please try again.',
          duration: 6000,
          variant: 'destructive',
        })
      // if (serverError) return createForm.setError('root', { message: serverError.message, type: 'manual' })
      // console.log(error)
      // return createForm.setError('root', { message: 'Saving keys failed. Please try again.', type: 'manual' })
    }
  }

  return {
    isLoading,
    setIsLoading,
    createForm,
    onSubmitCreate,
  }
}
