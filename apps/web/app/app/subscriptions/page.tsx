'use client'

import { H4 } from '@linkerry/ui-components/server'
import { useClientQuery } from '../../../libs/react-query'
import { subscriptionsQueryConfig } from '../../../modules/billing/subscriptions/query-configs'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { PageContainer } from '../components/PageContainer'
import { SubscriptionCard } from './SubscriptionCard'
import { UsageCard } from './UsageCard'

export default function Page() {
	const { data, error, status } = useClientQuery(subscriptionsQueryConfig.getMany())

	return (
		<PageContainer padding={'large'}>
			<H4 className="mb-2 pl-1">Your Subscription</H4>
			{status === 'pending' ? (
				<Spinner />
			) : status === 'error' ? (
				<ErrorInfo errorObject={error} />
			) : (
				data.map((subscription) => (
					<div key={subscription._id} className="grid grid-cols-2 gap-2">
						<SubscriptionCard subscription={subscription} />
						<UsageCard subscription={subscription} />
					</div>
				))
			)}
		</PageContainer>
	)
}
