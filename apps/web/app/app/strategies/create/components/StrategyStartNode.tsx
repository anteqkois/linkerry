'use client'

import { StrategyType } from '@market-connector/types'
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
  CardTitle
} from '@market-connector/ui-components/server'
import { NodeProps } from 'reactflow'
import { useStrategy } from '../../../../../modules/strategies/useStrategy'

type Props = NodeProps

export function StrategyStartNode({ data, xPos, yPos }: Props) {
  const { createForm, isLoading, onSubmitCreate } = useStrategy()
  return (
    <>
      <div className="w-full h-full">
        <Card>
          <CardHeader>
            <CardTitle>Strategy</CardTitle>
            <CardDescription>Every strategy creation starts with giving a name 🚀.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-8 w-96">
                <FormField
                  control={createForm.control}
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
                  control={createForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        // onValueChange={(v) => {
                        //   field.onChange(v)
                        //   const selectedExchange = exchanges.find((exchange) => exchange.code === v)
                        //   form.setValue('exchange', selectedExchange?._id!)
                        // }}
                        defaultValue={field.value}
                      >
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
                                  {/* {exchange.urls.logo ? (
                                    <Image
                                      src={exchange.urls.logo}
                                      width={75}
                                      height={24}
                                      alt={`${exchange.name} logo`}
                                      className="rounded-sm"
                                    />
                                  ) : null} */}
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
    </>
  )
}
