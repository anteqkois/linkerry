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
} from '@market-connector/ui-components/client'
import { Button } from '@market-connector/ui-components/server'
import { useUser } from '../../../../modules/user/useUser'

type Props = { exchanges: IExchange[] }

export const UserKeysForm = ({ exchanges }: Props) => {
  const { user } = useUser()
  const form = useForm<z.infer<typeof userKeysSchema>>({
    resolver: zodResolver(userKeysSchema),
    defaultValues: {
      aKey: '',
      exchange: '',
      exchangeCode: ExchangeCode.binance,
      name: '',
      sKey: '',
      user: user._id,
    },
  })

  function onSubmit(values: z.infer<typeof userKeysSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      {JSON.stringify(exchanges)}
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
                  form.setValue('exchange', 'ADD DB ID')
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder="Select Exchange" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  <SelectItem value={ExchangeCode.binance}>Binance</SelectItem>
                  <SelectItem value={ExchangeCode.bybit}>ByBit</SelectItem>
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
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
