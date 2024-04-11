import { ProductConfig, SubscriptionPopulated } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Card, CardContent, H4 } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes } from 'react'

export interface UsageCardProps extends HTMLAttributes<HTMLElement> {
	subscription: SubscriptionPopulated
}

const configuration: Record<
	keyof ProductConfig,
	{
		displayName: string
		// description:''
	}
> = {
	connections: { displayName: 'Number of added app connections' },
	connectors: { displayName: 'Avaible connectors' },
	fileUploadsMB: { displayName: 'Files upload space [MB]' },
	flowRunIntervalGap: { displayName: 'Time between single flow runs' },
	flows: { displayName: 'Created flows amount' },
	flowSteps: { displayName: 'Number of steps for single flow' },
	maximumActiveFlows: { displayName: 'Active Flows' },
	maximumExecutionTime: { displayName: 'Maximum flow time execution' },
	minimumPollingInterval: { displayName: 'Pooling interval for trigger connectors' },
	projectMembers: { displayName: 'Project members' },
	tasks: { displayName: 'Avaible tasks amount per month' },
	triggersAmount: { displayName: 'Triggers amount in single flow' },
}

const ConfigurationItem = ({ label, value }: { label: string; value: string | number }) => {
	return (
		<p className="flex justify-between hover:bg-accent hover:text-accent-foreground py-1 px-2 rounded-md">
			<span className="text-muted-foreground">{label}:</span>
			<span>{value}</span>
		</p>
	)
}

export const UsageCard = ({ subscription }: UsageCardProps) => {
	return (
		<Card>
			<CardContent>
				<div className="my-4 flex items-center space-x-4">
					<div className="flex flex-col">
						<span className="text-muted-foreground">Usage for product</span>
						<span>{subscription.products[0].name}</span>
					</div>
					<Separator orientation="vertical" className="h-14" />
					<div className="flex flex-col">
						<span className="text-muted-foreground">Reset at</span>
						<span>{dayjs().add(1, 'month').set('date', 1).format(`DD MMMM YYYY`)}</span>
					</div>
					<Separator orientation="vertical" className="h-14" />
				</div>
				<Separator />
				{subscription.products.map((product) => (
					<div className="w-1/2" key={product._id}>
						<div className="my-2" key={product._id}>
							<H4 className="mb-2">
								Product: <span className="font-normal">{product.name}</span>
							</H4>
							{(Object.entries(product.config) as [keyof ProductConfig, any][]).map(([name, value]) => (
								<ConfigurationItem key={name} label={configuration[name].displayName} value={value} />
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
