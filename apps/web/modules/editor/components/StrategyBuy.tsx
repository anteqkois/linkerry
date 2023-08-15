import {
  IStrategyBuy,
  IStrategyBuy_UpdateInput,
  StrategyBuyType,
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
import { useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useEditor } from '../useEditor'
import { IStrategyBuyNode } from '../nodes'

export interface StrategyBuyProps {
  form: UseFormReturn<IStrategyBuy_UpdateInput, any, undefined>
  onSubmit: any
  isLoading: boolean
  strategyBuy: Partial<IStrategyBuy>
  nodeId: IStrategyBuyNode['id']
}

export const StrategyBuy = ({ form, isLoading, onSubmit, strategyBuy, nodeId }: StrategyBuyProps) => {
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const { updateNode } = useEditor()

  const handleSubmit = useCallback(
    async (formData: any) => {
      const res = await onSubmit(formData)
      if (res?._id)
        updateNode(nodeId, {
          data: {
            strategyBuy: res,
          },
        })
      setShowEditForm(false)
    },
    [nodeId, updateNode, onSubmit],
  )

  return (
    <div className="w-full h-full">
      <Card className="w-editor-element">
        {!showEditForm ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={'icon'} className="absolute top-2 right-2">
                <span className="sr-only">Open menu</span>
                <Icons.more className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex gap-1 justify-between items-center">
                <span>Edit</span>
                <Icons.edit />
              </DropdownMenuItem>
              <DropdownMenuItem>Move higher</DropdownMenuItem>
              <DropdownMenuItem>
                <span>Delete</span>
                <Icons.delete />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <CardHeader>
          <CardTitle>Strategy Buy</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of your startegy buy</FormLabel>
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
