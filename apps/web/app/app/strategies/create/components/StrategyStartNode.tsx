'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@market-connector/ui-components/client'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H4,
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
                {createForm.control ? (
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of your startegy</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
                <Button type="submit">Start</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
