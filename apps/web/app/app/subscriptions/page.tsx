'use client'

import { Price, Product, SubscriptionPeriod, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { H2 } from '@linkerry/ui-components/server'
import { useCallback, useState } from 'react'
import { Plans } from '../../../modules/billing/components/Plans'
import { SubscriptionsApi } from '../../../modules/billing/subscriptions'
import { useSubscriptions } from '../../../modules/billing/subscriptions/useSubscriptions'
import { useUsage } from '../../../modules/billing/usage/useUsage'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { PageContainer } from '../components/PageContainer'
import { SubscriptionCard } from './SubscriptionCard'
import { UsageCard } from './UsageCard'

export default function Page() {
	const { currentSubscription, currentPlan, subscriptionsError, subscriptionsStatus } = useSubscriptions()
	const { usage } = useUsage()
	const { toast } = useToast()
	const [loading, setLoading] = useState(false)

	const onSelectPlanConfiguration = useCallback(async ({ price, productPlan }: { productPlan: Product; price: Price }) => {
		setLoading(true)
		try {
			const { data } = await SubscriptionsApi.change({
				items: [
					{
						priceId: price._id,
						productId: productPlan._id,
					},
				],
				period: SubscriptionPeriod.MONTHLY,
			})
			window.location.href = data.checkoutUrl
		} catch (error) {
			let errorMessage = 'Unknown error occures during creation new subscription. Please contact with our Team.'
			if (isCustomHttpExceptionAxios(error)) errorMessage = error.response.data.message

			toast({
				title: 'Payment failed',
				description: errorMessage,
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
		// try {
		// 	/* Open first paid subscription */
		// 	if (currentSubscription?.products[0].name === 'Free') {
		// 		const response = await
		// 	} else {
		// 	}

		// 	/* Change paid subscription */
		// } catch (error) {}
		// // const

		// console.log(price, productPlan)
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
			<Plans onSelectPlan={onSelectPlanConfiguration} currentPlan={currentPlan} loading={loading}/>
		</PageContainer>
	)
}
