'use client'

import { Price, Product } from '@linkerry/shared'
import { H2 } from '@linkerry/ui-components/server'
import { useCallback } from 'react'
import { Plans } from '../../../modules/billing/components/Plans'
import { useSubscriptions } from '../../../modules/billing/subscriptions/useSubscriptions'
import { useUsage } from '../../../modules/billing/usage/useUsage'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { PageContainer } from '../components/PageContainer'
import { SubscriptionCard } from './SubscriptionCard'
import { UsageCard } from './UsageCard'

export default function Page() {
	const { currentSubscription, subscriptionsError, subscriptionsStatus } = useSubscriptions()
	const { usage } = useUsage()

	const onSelectPlanConfiguration = useCallback(({ price, productPlan }: { productPlan: Product; price: Price }) => {
		console.log(price, productPlan)
	}, [])

	return (
		<PageContainer padding={'largeOnlyDesktop'} className="space-y-3">
			{subscriptionsStatus === 'error' ? (
				<ErrorInfo errorObject={subscriptionsError} />
			) : subscriptionsStatus === 'pending' ? (
				<Spinner />
			) : currentSubscription ? (
				<div key={currentSubscription._id} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
					<SubscriptionCard subscription={currentSubscription} />
					<UsageCard usage={usage} subscription={currentSubscription} />
				</div>
			) : (
				<ErrorInfo message="Can not retrive subscription" />
			)}
			<H2 className="text-center lg:hidden">Upgarde Plan</H2>
			<Plans onSelectPlan={onSelectPlanConfiguration} />
		</PageContainer>
	)
}
