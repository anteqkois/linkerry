'use client'

import { H4 } from '@linkerry/ui-components/server'
import { useClientQuery } from '../../../libs/react-query'
import { subscriptionsQueryConfig } from '../../../modules/billing/subscriptions/query-configs'
import { usageQueryConfig } from '../../../modules/billing/usage/query-configs'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { PageContainer } from '../components/PageContainer'
import { SubscriptionCard } from './SubscriptionCard'
import { UsageCard } from './UsageCard'

export default function Page() {
	const { data: subscriptions, error: subscriptionsError, status: subscriptionsStatus } = useClientQuery(subscriptionsQueryConfig.getMany())
	const { data: usage, error: usageError, status: usageStatus } = useClientQuery(usageQueryConfig.getMany())

	return (
		<PageContainer padding={'large'}>
			<H4 className="mb-2 pl-1">Your Subscription</H4>
			{subscriptionsStatus === 'pending' ? (
				<Spinner />
			) : subscriptionsStatus === 'error' ? (
				<ErrorInfo errorObject={subscriptionsError} />
			) : (
				subscriptions.map((subscription) => (
					<div key={subscription._id} className="grid grid-cols-2 gap-2">
						<SubscriptionCard subscription={subscription} />
						<UsageCard  usage={usage} />
					</div>
				))
			)}
		</PageContainer>
	)
}
