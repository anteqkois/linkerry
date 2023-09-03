import { IStrategy_StrategyBuyExpanded, IStrategy_StrategyBuyPatchResponse } from '@market-connector/types'
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
  Switch,
  useToast,
} from '@market-connector/ui-components/client'
import { Button, Card, CardContent, CardHeader, CardTitle, Icons, Muted } from '@market-connector/ui-components/server'
import { useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Handle, Position } from 'reactflow'
import { StrategyApi } from '../../strategies/api'
import { IStrategy_StrategyBuyPatchSchema } from '../../strategies/validations'
import { IStrategyBuyNode } from '../nodes'
import { useEditor } from '../useEditor'
import { Property } from './Property'

export interface StrategyBuyProps {
  form: UseFormReturn<IStrategy_StrategyBuyPatchSchema, any, undefined>
  onSubmit: (formData: IStrategy_StrategyBuyPatchSchema) => Promise<IStrategy_StrategyBuyPatchResponse | undefined>
  isLoading: boolean
  strategyBuy: IStrategy_StrategyBuyExpanded
  nodeId: IStrategyBuyNode['id']
}

export const StrategyBuy = ({ form, isLoading, onSubmit, strategyBuy, nodeId }: StrategyBuyProps) => {
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const { updateNode } = useEditor()

  const handleSubmit = useCallback(
    async (formData: IStrategy_StrategyBuyPatchSchema) => {
      // Update strategy buy
      const res = await onSubmit(formData)

      if (res) {
        updateNode(nodeId, {
          data: {
            strategyBuy: res,
          },
        })
      }
      setShowEditForm(false)
    },
    [nodeId, updateNode, onSubmit],
  )

  const handleRemoveStrategyBuy = async () => {
    // try {
    //   if (!lastDbId.StrategyNode) {
    //     toast({
    //       variant: 'destructive',
    //       content: 'Can not find strategy id. Refresh page and try again.',
    //     })
    //     return
    //   }
    //   // Remove form db
    //   const { status } = await StrategyApi.removeStrategyBuy(lastDbId.StrategyNode[0], strategyBuy.id)
    //   if (status !== 200) throw new Error('Invalid delete response')

    //   // Remove Strategy Buy Node
    //   console.log(nodeId)
    //   deleteNode(nodeId)
    //   // Remove Strategy Buy Edges
    //   // Remove Add Condition Node/Edges
    // } catch (error) {
    //   console.log(error)
    //   toast({
    //     variant: 'destructive',
    //     content: 'Something get wrong.',
    //   })
    // }
  }

  return (
    <div className="w-full h-full">
      <Card className="w-editor-element">
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
              onClick={() => setShowEditForm((prev) => !prev)}
            >
              <span>{showEditForm ? 'Details' : 'Edit'}</span>
              {showEditForm ? null : <Icons.edit />}
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Move higher</DropdownMenuItem> */}
            <DropdownMenuItem
              className="flex gap-1 justify-between items-center focus:bg-destructive focus:text-destructive-foreground"
              onClick={handleRemoveStrategyBuy}
            >
              <span>Remove</span>
              <Icons.delete />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-strategy-buy">Strategy Buy</CardTitle>
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
                {/* <FormField
                  control={form.control}
                  name="validityUnix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy event validity time</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
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
                /> */}
                <Button type="submit" className="w-full" variant={'secondary'} loading={isLoading}>
                  Save Strategy Buy
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col ">
              <Property label="Name" value={strategyBuy.strategyBuy?.name} />
              <Property label="Type" value={strategyBuy.strategyBuy?.type} />
              <Property label="Active" value={strategyBuy.active} />
              <Property label="Conditions Count" clasaName="relative">
                <Muted>
                  {strategyBuy.strategyBuy?.conditions.length}
                  <Handle
                    type="source"
                    id="condition"
                    position={Position.Right}
                    className="!bg-condition h-8 w-2 border-none rounded-sm -right-7"
                    isConnectableStart={false}
                  />
                </Muted>
              </Property>
              <Property label="Triggered Times" value={strategyBuy.strategyBuy?.triggeredTimes} />
              {strategyBuy.strategyBuy?.conditionMarketProvider ? (
                <Property label="Triggered Times" value={strategyBuy.strategyBuy?.conditionMarketProvider} />
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
