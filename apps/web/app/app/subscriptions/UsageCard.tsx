import { PlanConfigurationDetailsValue, PlanProductConfiguration, SubscriptionPopulated, planConfigurationDetails } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Card, CardContent, H4 } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes } from 'react'
import { ErrorInfo } from '../../../shared/components'
import { KeyValueItem } from '../../../shared/components/KeyValueItem'

export interface UsageCardProps extends HTMLAttributes<HTMLElement> {
  subscription: SubscriptionPopulated
  usage?: Partial<PlanProductConfiguration>
}

export const UsageCard = ({ usage, subscription }: UsageCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="my-4 flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Usage since</span>
            <span>{dayjs().set('date', 1).format(`DD MMMM YYYY`)}</span>
          </div>
          <Separator orientation="vertical" className="h-14" />
          <div className="flex flex-col">
            <span className="text-muted-foreground">Reset at</span>
            <span>{dayjs().add(1, 'month').set('date', 1).format(`DD MMMM YYYY`)}</span>
          </div>
          <Separator orientation="vertical" className="h-14" />
        </div>
        <Separator />
        {usage ? (
          <div className="mt-2">
            <H4 className="">Current Usage</H4>
            {(Object.entries(planConfigurationDetails) as [keyof PlanProductConfiguration, PlanConfigurationDetailsValue][]).map(([name, value]) => (
              <KeyValueItem
                key={name}
                label={value.displayName}
                value={usage[name] ? `${usage[name]} / ${subscription.items[0].product.config[name]}` : '-'}
              />
            ))}
          </div>
        ) : (
          <ErrorInfo message="Can not retrive your current usage" className="p-4" />
        )}{' '}
      </CardContent>
    </Card>
  )
}
