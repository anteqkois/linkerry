import { PlanProductConfiguration, Price, Product, ProductType, ProductWithPrices, SubscriptionPeriod } from '@linkerry/shared'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes, useCallback } from 'react'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { useProducts } from '../products/useProducts'
import { PlanCard, PlanCardProps } from './PlanCard'

export interface PlansProps extends HTMLAttributes<HTMLElement> {
	onSelectPlan: (data: { productPlan: Product; price: Price }) => void
}

export const Plans = ({ onSelectPlan, className }: PlansProps) => {
	const { plans, plansError, plansStatus } = useProducts()

	const onSelectEnterPrise = useCallback(({ price, productPlan }: { productPlan: Product; price: Price }) => {
		console.log(price, productPlan)
	}, [])

	if (plansStatus === 'pending') return <Spinner />
	if (plansStatus === 'error') return <ErrorInfo errorObject={plansError} />

	return (
		<div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3', className)}>
			{plans
				?.filter((plan) => plan.visible)
				?.map((plan) => {
					const config = plansConfig[plan.name]

					return (
						<PlanCard
							key={plan.name}
							price={plan.prices[0]}
							product={plan}
							buttonVariant={config.buttonVariant}
							onSelectPlan={onSelectPlan}
							popular={config.popular}
						/>
					)
				})}
			<PlanCard
				key={enterPrisePlan.name}
				price={enterPrisePlan.prices[0]}
				product={enterPrisePlan}
				buttonVariant={'default'}
				onSelectPlan={onSelectEnterPrise}
				priceSlot={<p className="text-center font-medium text-3xl sm:text-2xl lg:text-xl lg:leading-10 xl:text-3xl ">Contact for pricing</p>}
			/>
		</div>
	)
}

const enterPrisePlan: ProductWithPrices = {
	_id: '785341762354671789234',
	name: 'Enterprise',
	type: ProductType.PLAN,
	config: {
		minimumPollingInterval: 2,
		connections: 'unlimited',
		connectors: 'all',
		tasks: 'unlimited',
		projectMembers: 'unlimited',
		flowSteps: 35,
		triggersAmount: 5,
		flows: 'unlimited',
		fileUploadsMB: 'unlimited',
		flowRunIntervalGap: 0,
		maximumActiveFlows: 'unlimited',
		maximumExecutionTime: 'unlimited',
	} as unknown as PlanProductConfiguration,
	priority: 4,
	visible: true,
	stripe: {
		id: 'prod_PwuZ7SPO0TCLue',
	},
	createdAt: '2024-04-18T19:36:56.045Z',
	updatedAt: '2024-04-18T19:36:56.045Z',
	shortDescription: 'Experience heightened security, access privileges and support. Access our cutting-edge automation functionalities.',
	prices: [
		{
			_id: '567829789123902823490',
			price: 0,
			period: SubscriptionPeriod.MONTHLY,
			default: true,
			productId: '',
			stripe: {
				id: '',
			},
			currencyCode: 'USD',
			priority: 1,
			visible: true,
			createdAt: '2024-04-18T19:40:59.063Z',
			updatedAt: '2024-04-18T19:40:59.063Z',
		},
	],
}

const plansConfig: Record<
	string,
	{
		buttonVariant: PlanCardProps['buttonVariant']
		popular?: PlanCardProps['popular']
	}
> = {
	Free: {
		buttonVariant: 'outline',
	},
	Basic: {
		buttonVariant: 'default',
	},
	Professional: {
		buttonVariant: 'default',
		popular: true,
	},
	Enterprise: {
		buttonVariant: 'default',
	},
}
