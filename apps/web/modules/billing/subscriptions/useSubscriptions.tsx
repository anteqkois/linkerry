'use client'

import { ProductType, SubscriptionStatus } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { subscriptionsQueryConfig } from './query-configs'

export const useSubscriptions = () => {
	const { toast } = useToast()
	const { data: subscriptions, error: subscriptionsError, status: subscriptionsStatus } = useClientQuery(subscriptionsQueryConfig.getMany())

	const currentSubscription = useMemo(() => {
		if (subscriptionsStatus === 'error') {
			toast({
				title: 'Can not fetch your current subscription',
				// TODO check
				description: subscriptionsError.message,
			})
		} else if (subscriptionsStatus === 'pending') return null
		else {
			return subscriptions.find((subscription) => subscription.status === SubscriptionStatus.ACTIVE)
		}
	}, [subscriptions, subscriptionsStatus])

	const currentPlanConfiguration = useMemo(() => {
		if (!currentSubscription) return null
		const currentPlanProducts = currentSubscription.products.filter((product) => product.type === ProductType.PLAN)
		if (currentPlanProducts.length > 1) console.warn(`More than one product plan`, currentPlanProducts)
		return currentPlanProducts[0].config
	}, [currentSubscription])

	return {
		subscriptions,
		subscriptionsError,
		subscriptionsStatus,
		currentSubscription,
		currentPlanConfiguration
	}
}
