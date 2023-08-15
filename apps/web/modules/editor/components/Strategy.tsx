import { IStrategyExpand, IStrategy_UpdateInput, IStrategy_UpdateResponse } from '@market-connector/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@market-connector/ui-components/client'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icons,
} from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Handle, Position } from 'reactflow'
import { Property } from './Property'
import { useEditor } from '../useEditor'
import { CustomNodeId } from '../nodes'

export interface StrategyProps {
  form: UseFormReturn<IStrategy_UpdateInput, any, undefined>
  onSubmit: (data: any) => Promise<IStrategy_UpdateResponse | undefined>
  isLoading: boolean
  strategy?: Partial<IStrategyExpand<'strategyBuy.strategyBuy'>>
  className?: string
  nodeId: CustomNodeId
}

export const Strategy = ({ form, isLoading, onSubmit, className, strategy, nodeId }: StrategyProps) => {
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const { updateNode } = useEditor()

  const handleSubmit = useCallback(
    async (formData: any) => {
      const res = await onSubmit(formData)
      if (res?._id)
        updateNode(nodeId, {
          data: {
            strategy: {...res, strategyBuy: strategy?.strategyBuy},
          },
        })
      setShowEditForm(false)
    },
    [onSubmit, updateNode, nodeId, strategy?.strategyBuy],
  )

  return (
    <div className={cn('w-full h-full', className)}>
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
              <DropdownMenuItem
                className="flex gap-1 justify-between items-center"
                onClick={() => setShowEditForm(true)}
              >
                <span>Edit</span>
                <Icons.edit />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Delete</span>
                <Icons.delete />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-primary">
            <Icons.strategy /> Strategy
          </CardTitle>
          <CardDescription>
            You can build using sub-strategies such as &apos;Buy Strategies&apos;, &apos;Execution Strategies&apos;.
            {/* You can build using sub-strategies such as <span className="text-strategy-buy">Buy Strategies</span>,{' '}
            <span className="text-strategy-execution">Execution Strategies</span> */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showEditForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of your startegy</FormLabel>
                      <FormControl>
                        <Input placeholder="Ethereum bottom" {...field} />
                      </FormControl>
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
                        {/* <FormDescription>When active, your strategy is waiting for a buy signal.</FormDescription> */}
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="testMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border py-2 px-3">
                      <div className="space-y-0.5">
                        <FormLabel>Test Mode</FormLabel>
                        {/* <FormDescription>When active, your strategy is waiting for a buy signal.</FormDescription> */}
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                type="submit"
                className="w-full border-primary/50"
                variant={'outline'}
                loading={isLoading}
              >
                Save
              </Button>
                {/* <Button type="submit" className="w-full" loading={isLoading}>
                  Save
                </Button> */}
              </form>
            </Form>
          ) : (
            <div className="flex flex-col ">
              <Property label="Name" value={strategy?.name} />
              <Property label="Type" value={strategy?.type} />
              <Property label="Active" value={strategy?.active} />
              <Property label="State" value={strategy?.state} />
              <Property label="Cycle Count" value={strategy?.triggeredTimes} />
              <Property label="Test Mode" value={strategy?.testMode} />
            </div>
          )}
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
