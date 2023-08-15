import {
  IStrategyBuy,
  StrategyBuyType
} from '@market-connector/types'
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
  SelectValue
} from '@market-connector/ui-components/client'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@market-connector/ui-components/server'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { IStrategy_StrategyBuyCreateSchema } from '../../strategies/validations'
import { IStrategyBuyNode } from '../nodes'
import { useEditor } from '../useEditor'

export interface CreateStrategyBuyFormProps {
  form: UseFormReturn<IStrategy_StrategyBuyCreateSchema>
  onSubmit: any
  isLoading: boolean
  baseStrategyBuy?: Partial<IStrategyBuy>
  nodeId: IStrategyBuyNode['id']
  // nodeId: CustomNodeId
}

export const CreateStrategyBuyForm = ({
  form,
  isLoading,
  onSubmit,
  nodeId,
  baseStrategyBuy,
}: CreateStrategyBuyFormProps) => {
  const { updateNode } = useEditor()

  const handleSubmit = useCallback(
    async (formData: any) => {
      const res = await onSubmit(formData)
      if (res?._id)
        updateNode(nodeId, {
          id: `${nodeId.split('_')[0]}_${res?._id}` as IStrategyBuyNode['id'],
          data: {
            strategyBuy: res,
          },
        })
    },
    [nodeId, updateNode, onSubmit],
  )

  return (
    <div className="w-full h-full">
      <Card className="w-editor-element">
        <CardHeader>
          <CardTitle className="text-strategy-buy">Strategy Buy</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
