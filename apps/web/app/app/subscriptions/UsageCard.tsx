import { ProductConfig, SubscriptionPopulated } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Card, CardContent, H4 } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes } from 'react'
import { ConfigurationItem } from '../../../modules/billing/components/ConfigItem'
import { PlanConfigurationDetailsValue, planConfigurationDetails } from '../../../modules/billing/planConfigurationDetails'
import { ErrorInfo } from '../../../shared/components'

export interface UsageCardProps extends HTMLAttributes<HTMLElement> {
	subscription: SubscriptionPopulated
	usage?: Partial<ProductConfig>
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
					<div className="my-2">
						<H4 className="mb-2">Current Usage</H4>
						{(Object.entries(planConfigurationDetails) as [keyof ProductConfig, PlanConfigurationDetailsValue][]).map(([name, value]) => (
							// <ConfigurationItem key={name} label={value.displayName} value={usage[name] ?? '-'} />
							// <ConfigurationItem key={name} label={value.displayName} value={`${usage[name] ?? '_'} / ${subscription.products[0].config[name]}`} />
							<ConfigurationItem
								key={name}
								label={value.displayName}
								value={usage[name] ? `${usage[name]} / ${subscription.products[0].config[name]}` : '-'}
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
