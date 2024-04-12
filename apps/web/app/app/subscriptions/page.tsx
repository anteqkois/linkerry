'use client'

import { H4 } from '@linkerry/ui-components/server'
import { useSubscriptions } from '../../../modules/billing/subscriptions/useSubscriptions'
import { useUsage } from '../../../modules/billing/usage/useUsage'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { PageContainer } from '../components/PageContainer'
import { SubscriptionCard } from './SubscriptionCard'
import { UsageCard } from './UsageCard'

export default function Page() {
	const { currentSubscription, subscriptionsError, subscriptionsStatus } = useSubscriptions()
	const { usage } = useUsage()

	return (
		<PageContainer padding={'large'}>
			<H4 className="mb-2 pl-1">Your Subscription</H4>
			{subscriptionsStatus === 'error' ? (
				<ErrorInfo errorObject={subscriptionsError} />
			) : subscriptionsStatus === 'pending' ? (
				<Spinner />
			) : currentSubscription ? (
				<div key={currentSubscription._id} className="grid grid-cols-2 gap-2">
					<SubscriptionCard subscription={currentSubscription} />
					<UsageCard usage={usage} subscription={currentSubscription} />
				</div>
			) : (
				<ErrorInfo message="Can not retrive subscription" />
			)}
			{/* {subscriptionsStatus === 'pending' ? (
				<Spinner />
			) : subscriptionsStatus === 'error' ? (
				<ErrorInfo errorObject={subscriptionsError} />
			) : (
				subscriptions?.map((subscription) => (
					<div key={subscription._id} className="grid grid-cols-2 gap-2">
						<SubscriptionCard subscription={subscription} />
						<UsageCard usage={usage} subscription={subscription} />
					</div>
				))
			)} */}
		</PageContainer>
	)
}
