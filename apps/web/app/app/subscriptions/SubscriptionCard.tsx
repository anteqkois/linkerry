import { PlanConfigurationDetailsValue, PlanProductConfiguration, SubscriptionPopulated, planConfigurationDetails } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Card, CardContent, H4 } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes } from 'react'
import { ConfigurationItem } from '../../../modules/billing/components/ConfigItem'

export interface SubscriptionCardProps extends HTMLAttributes<HTMLElement> {
	subscription: SubscriptionPopulated
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
	return (
		<Card>
			<CardContent>
				<div className="my-4 flex items-center space-x-4">
					<div className="flex flex-col">
						<span className="text-muted-foreground">Valid to</span>
						<span>{dayjs(subscription.validTo).format(`DD MMMM YYYY`)}</span>
					</div>
					<Separator orientation="vertical" className="h-14" />
					<div className="flex flex-col">
						<span className="text-muted-foreground">Frequency</span>
						<span>Billing {subscription.period}</span>
					</div>
					<Separator orientation="vertical" className="h-14" />
					<div className="flex flex-col">
						<span className="text-muted-foreground">Next charge</span>
						<span>{dayjs(subscription.currentPeriodEnd).format(`DD MMMM YYYY`)}</span>
					</div>
					<Separator orientation="vertical" className="h-14" />
					{/* <div className="flex flex-col">
						<span className="text-muted-foreground">Trial Started At</span>
						<span>{subscription.trialStartedAt ? dayjs(subscription.trialStartedAt).format(`DD MMMM YYYY`) : <p className="text-center">-</p>}</span>
					</div>
					<Separator orientation="vertical" className="h-14" />
					<div className="flex flex-col">
						<span className="text-muted-foreground">Trial Ended At</span>
						<span>{subscription.trialEndedAt ? dayjs(subscription.trialEndedAt).format(`DD MMMM YYYY`) : <p className="text-center">-</p>}</span>
					</div>
					<Separator orientation="vertical" className="h-14" /> */}
				</div>
				<Separator />
				{subscription.products.map((product) => (
					<div key={product._id}>
						<div className="my-2" key={product._id}>
							<H4 className="mb-2">
								Product: <span className="font-normal">{product.name}</span>
							</H4>
							{(Object.entries(planConfigurationDetails) as [keyof PlanProductConfiguration, PlanConfigurationDetailsValue][]).map(([name, value]) => (
								<ConfigurationItem key={name} label={value.displayName} value={product.config[name]} />
							))}
						</div>
					</div>
				))}
			</CardContent>
			{/* <CardFooter className="flex justify-between">
<Button variant="outline">Cancel</Button>
<Button>Deploy</Button>
</CardFooter> */}
		</Card>
	)
}
