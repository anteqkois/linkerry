import { IStrategy_CreateResponse, StrategyType } from '@market-connector/types'
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
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@market-connector/ui-components/server'
import { UseFormReturn } from 'react-hook-form'
import { IStrategy_StaticMarketCreateSchema } from '../../strategies/validations'
import { useEditor } from '../useEditor'
import { useCallback } from 'react'
import { CustomNodeId } from '../nodes'
import { usePathname, useRouter } from 'next/navigation'

export interface StrategyFormProps {
  form: UseFormReturn<IStrategy_StaticMarketCreateSchema>
  onSubmit: (data: any) => Promise<IStrategy_CreateResponse | undefined>
  isLoading: boolean
  nodeId: CustomNodeId
}

export const CreateStrategyForm = ({ form, isLoading, onSubmit, nodeId }: StrategyFormProps) => {
  const pathname = usePathname()
  const { push } = useRouter()
  const { updateNode } = useEditor()

  // const handleSubmit = useCallback(
  //   async (formData: IStrategy_StaticMarketCreateSchema) => {
  //     const res = await onSubmit(formData)
  //     if (res)
  //       updateNode(nodeId, {
  //         data: {
  //           strategy: { ...res, strategyBuy: [] },
  //         },
  //       })

  //     const node = getNodeById(nodeId)

  //     addNode(addBuyStrategyNodeFactory({ parentId: nodeId, x: node?.width ?? 0 / 2, y: node?.height ?? 0 + 20 }))
  //   },
  //   [onSubmit, updateNode],
  // )
  const handleSubmit = useCallback(
    async (formData: IStrategy_StaticMarketCreateSchema) => {
      const res = await onSubmit(formData)
      if (res) push(`${pathname}/${res._id}`)
    },
    [onSubmit, updateNode],
  )

  return (
    <div className="w-full h-full">
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle>Strategy</CardTitle>
          <CardDescription>Every strategy creation starts with giving a name 🚀.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-96">
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger ref={field.ref}>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        {Object.keys(StrategyType).map((type) => {
                          return (
                            <SelectItem value={type} key={type} disabled={type === StrategyType.StrategyDynamicMarket}>
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
              <FormField
                control={form.control}
                name="testMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border py-2 px-3">
                    <div className="space-y-0.5">
                      <FormLabel>Test Mode</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" loading={isLoading}>
                Start
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
