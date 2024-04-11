import { ProductConfig } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Card, CardContent, H4 } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes } from 'react'
import { ErrorInfo } from '../../../shared/components'
import { ConfigurationItem } from './ConfigItem'
import { ProductConfigurationDetailsValue, productConfigurationDetails } from './config'

export interface UsageCardProps extends HTMLAttributes<HTMLElement> {
	usage?: Partial<ProductConfig>
}

export const UsageCard = ({ usage }: UsageCardProps) => {
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
						{/* {(Object.entries(productConfigurationDetails) as [keyof ProductConfig, ][]).map(([name, value]) => ( */}
						{(Object.entries(productConfigurationDetails) as [keyof ProductConfig, ProductConfigurationDetailsValue][]).map(([name, value]) => (
							<ConfigurationItem key={name} label={value.displayName} value={usage[name] ?? 'Fixed Usage'} />
						))}
						{/* {(Object.entries(product.config) as [keyof ProductConfig, any][]).map(([name, value]) => (
							<ConfigurationItem key={name} label={configuration[name].displayName} value={value} />
						))} */}
					</div>
				) : (
					<ErrorInfo message="Can not retrive your current usage" className="p-4" />
				)}
				{/* {subscription.products.map((product) => (
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
				))} */}
			</CardContent>
		</Card>
	)
}
