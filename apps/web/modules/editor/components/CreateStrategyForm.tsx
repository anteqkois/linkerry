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
  const { updateNode} = useEditor()

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
      if (res)
      push(`${pathname}/${res._id}`)
    },
    [onSubmit, updateNode],
  )

  return (
    <div className="w-full h-full">
      <Card>
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
