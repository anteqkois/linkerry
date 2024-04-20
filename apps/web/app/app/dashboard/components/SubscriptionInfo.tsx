'use client'

import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@linkerry/ui-components/server'
import Link from 'next/link'
import { HTMLAttributes } from 'react'
import { useSubscriptions } from '../../../../modules/billing/subscriptions/useSubscriptions'
import { ErrorInfo, Spinner } from '../../../../shared/components'

export interface SubscriptionInfoProps extends HTMLAttributes<HTMLElement> {}

export const SubscriptionInfo = () => {
	const { currentPlan, currentSubscription, subscriptionsError, subscriptionsStatus } = useSubscriptions()

	if (subscriptionsStatus === 'error') return <ErrorInfo errorObject={subscriptionsError} />
	if (subscriptionsStatus === 'pending') return <Spinner />

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Plan</CardTitle>
				<Icons.BankCard className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex justify-between items-end">
				<div>
					{currentPlan ? (
						<>
							<div className="text-2xl font-bold">{currentPlan?.name}</div>
							<p className="text-xs text-muted-foreground">{currentSubscription?.period}</p>
						</>
					) : (
						'Can not retrive plan'
					)}
				</div>
				<div>
					<Link href="/app/subscriptions">
						<Button>
							<Icons.Upgarde className="mr-2 h-4 w-4" />
							Upgrade Plan
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
