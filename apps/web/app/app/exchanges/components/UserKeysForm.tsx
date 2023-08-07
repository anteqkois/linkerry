'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { userKeysSchema } from '../validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExchangeCode, IExchange } from '@market-connector/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@market-connector/ui-components/client'
import { Button, Icons } from '@market-connector/ui-components/server'
import { useUser } from '../../../../modules/user/useUser'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { UserKeysApi } from '../../../../modules/user-keys/api'
import { retriveServerHttpException } from '../../../../utils'

type Props = { exchanges: IExchange[] }

export const UserKeysForm = ({ exchanges }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const form = useForm<z.infer<typeof userKeysSchema>>({
    resolver: zodResolver(userKeysSchema),
    defaultValues: {
      aKey: '',
      exchange: exchanges[0]._id,
      exchangeCode: exchanges[0].code,
      name: '',
      sKey: '',
      user: user._id,
    },
  })

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const onSubmit = async (values: z.infer<typeof userKeysSchema>) => {
    console.log(values)
    setIsLoading(true)
    try {
      const res = await UserKeysApi.create(values)

      form.setValue('aKey', `${res.data.userKeys.aKeyInfo}...`)
      form.setValue('sKey', `${res.data.userKeys.sKeyInfo}...`)

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
      // if (serverError) return form.setError('root', { message: serverError.message, type: 'manual' })
      // console.log(error)
      // return form.setError('root', { message: 'Saving keys failed. Please try again.', type: 'manual' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="exchangeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange</FormLabel>
              <Select
                onValueChange={(v) => {
                  field.onChange(v)
                  const selectedExchange = exchanges.find((exchange) => exchange.code === v)
                  form.setValue('exchange', selectedExchange?._id!)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder="Select Exchange" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {exchanges.map((exchange) => {
                    return (
                      <SelectItem value={exchange.code} key={exchange._id}>
                        <span className="flex gap-2 items-center">
                          {exchange.urls.logo ? (
                            <Image
                              src={exchange.urls.logo}
                              width={75}
                              height={24}
                              alt={`${exchange.name} logo`}
                              className="rounded-sm"
                            />
                          ) : null}
                          <p>{exchange.name}</p>
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keys Name</FormLabel>
              <FormControl>
                <Input placeholder="Binance bot keys..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Key</FormLabel>
              <FormControl>
                <Input placeholder="Dc290z..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Key</FormLabel>
              <FormControl>
                <Input placeholder="Shj20z..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" variant="secondary">
            {isLoading ? <Icons.spinner className="mr-2 h-4 w-9 animate-spin" /> : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
