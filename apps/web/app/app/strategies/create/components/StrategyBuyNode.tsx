'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from '@market-connector/ui-components/client'
import { Button, H4 } from '@market-connector/ui-components/server'
import { NodeProps } from 'reactflow'
import { useStrategyBuy } from '../../../../../modules/strategies/useStrategyBuy'

type Props = NodeProps

export function StrategyBuyNode({ data, xPos, yPos }: Props) {
  const { form, isLoading, onSubmit } = useStrategyBuy()
  return (
    <>
      <div className="w-full h-full bg-background/60 borderd border-2 p-1 rounded-md">
        <div className="absolute -top-16">
          <H4>Buy strategies</H4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {form.control ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
