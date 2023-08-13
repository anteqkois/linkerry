import {
  IStrategyBuy,
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategyBuy_StaticMarket_UpdateInput,
  StrategyBuyType
} from '@market-connector/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@market-connector/ui-components/server'
import { UseFormReturn } from 'react-hook-form'

export interface CreateStrategyBuyFormProps {
  form: UseFormReturn<IStrategyBuy_StaticMarket_CreateInput, any, undefined>
  onSubmit: any
  isLoading: boolean
  baseStrategyBuy: Partial<IStrategyBuy>
}

export const CreateStrategyBuyForm = ({ form, isLoading, onSubmit, baseStrategyBuy }: CreateStrategyBuyFormProps) => {
  return (
    <div className="w-full h-full">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Buy</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of your startegy</FormLabel>
                    <FormControl>
                      <Input placeholder="Fast dump" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy Buy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger ref={field.ref}>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        {Object.keys(StrategyBuyType).map((type) => {
                          return (
                            <SelectItem
                              value={type}
                              key={type}
                              disabled={type === StrategyBuyType.StrategyBuyDynamicMarket}
                            >
                              <span className="flex gap-2 items-center">
                                <p>{type}</p>
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
              <Button
                type="submit"
                className="w-full text-strategy-buy border-strategy-buy/50"
                variant={'outline'}
                loading={isLoading}
              >
                Create Strategy Buy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
