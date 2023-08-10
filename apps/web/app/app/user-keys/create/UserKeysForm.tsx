'use client'

import { IExchange } from '@market-connector/types'
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
import Image from 'next/image'
import { useUserKeys } from '../../../../modules/user-keys/useUserKeys'

type Props = { exchanges: IExchange[] }

export const UserKeysForm = ({ exchanges }: Props) => {
  const { createForm, isLoading, onSubmitCreate } = useUserKeys()

  return (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-5">
        <FormField
          control={createForm.control}
          name="exchangeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange</FormLabel>
              <Select
                onValueChange={(v) => {
                  field.onChange(v)
                  const selectedExchange = exchanges.find((exchange) => exchange.code === v)
                  createForm.setValue('exchange', selectedExchange?._id!)
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
          control={createForm.control}
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
          control={createForm.control}
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
          control={createForm.control}
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
          <Button type="submit" loading={isLoading} className="w-full">
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
