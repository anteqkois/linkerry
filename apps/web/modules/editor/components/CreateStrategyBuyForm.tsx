import { IStrategyBuy, IStrategy_StrategyBuyCreateResponse, StrategyBuyType } from '@market-connector/types'
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
  Switch,
} from '@market-connector/ui-components/client'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@market-connector/ui-components/server'
import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { IStrategy_StrategyBuyCreateSchema } from '../../strategies/validations'
import { IStrategyBuyNode } from '../nodes'
import { useEditor } from '../useEditor'

export interface CreateStrategyBuyFormProps {
  form: UseFormReturn<IStrategy_StrategyBuyCreateSchema>
  onSubmit: (data: any) => Promise<IStrategy_StrategyBuyCreateResponse | undefined>
  isLoading: boolean
  baseStrategyBuy?: Partial<IStrategyBuy>
  nodeId: IStrategyBuyNode['id']
  parentNodeId: IStrategyBuyNode['id']
}

export const CreateStrategyBuyForm = ({
  form,
  isLoading,
  onSubmit,
  nodeId,
  baseStrategyBuy,
  parentNodeId,
}: CreateStrategyBuyFormProps) => {
  const { updateNode, updateEdge } = useEditor()

  const handleSubmit = useCallback(
    async (formData: any) => {
      const res = await onSubmit(formData)

      if (res?.id) {
        const newId = `${nodeId.split('_')[0]}_${res?.id}` as IStrategyBuyNode['id']
        updateNode(nodeId, {
          id: newId,
          data: {
            strategyBuy: res,
          },
        })

        updateEdge(`${parentNodeId}-${nodeId}`, { id: `${parentNodeId}-${newId}`, target: newId })
      }
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
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border py-2 px-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" variant={'secondary'} loading={isLoading}>
                Create Strategy Buy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
