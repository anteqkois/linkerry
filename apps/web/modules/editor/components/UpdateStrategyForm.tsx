import { IStrategy_StaticMarket_UpdateInput, StrategyType } from '@market-connector/types'
import {
  Checkbox,
  Form,
  FormControl,
  FormDescription,
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
  Icons,
} from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { UseFormReturn } from 'react-hook-form'

export interface UpdateStrategyFormProps {
  form: UseFormReturn<IStrategy_StaticMarket_UpdateInput, any, undefined>
  onSubmit: any
  isLoading: boolean
  className?: string
}

export const UpdateStrategyForm = ({ form, isLoading, onSubmit, className }: UpdateStrategyFormProps) => {
  return (
    <div className={cn('w-full h-full', className)}>
      {/* <Card className="w-108"> */}
      <Card className="w-144">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Icons.strategy /> Your Strategy
          </CardTitle>
          <CardDescription>
            You can build using sub-strategies such as <span className="text-strategy-buy">Buy Strategies</span>,{' '}
            <span className="text-strategy-execution">Execution Strategies</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Button type="submit" className="w-full" loading={isLoading}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
