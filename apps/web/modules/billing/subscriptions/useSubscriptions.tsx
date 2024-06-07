'use client'

import { CustomError, ErrorCode, ProductType, SubscriptionStatus } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { subscriptionsQueryConfig } from './query-configs'

interface UseSubscriptionProps {
  showErrorMessages?: boolean
}

export const useSubscriptions = (props?: UseSubscriptionProps) => {
  const { toast } = useToast()
  const { data: subscriptions, error: subscriptionsError, status: subscriptionsStatus, refetch: refetchSubscriptions } = useClientQuery(subscriptionsQueryConfig.getMany())

  const currentSubscription = useMemo(() => {
    if (subscriptionsStatus === 'error') {
      props?.showErrorMessages !== false &&
        toast({
          title: 'Can not fetch your current subscription',
          // TODO check
          description: subscriptionsError.message,
        })
    } else if (subscriptionsStatus === 'pending') return null
    else {
      const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === SubscriptionStatus.ACTIVE)
      if (activeSubscriptions.length !== 1) throw new CustomError(`Invalid amount of active subscriptions`, ErrorCode.INVALID_BILLING)
      return activeSubscriptions[0]
    }
  }, [subscriptions, subscriptionsStatus])

  const currentPlan = useMemo(() => {
    if (!currentSubscription) return null
    const currentPlanProducts = currentSubscription.items.filter((item) => item.product.type === ProductType.PLAN)
    if (currentPlanProducts.length > 1) console.warn(`More than one product plan`, currentPlanProducts)
    return currentPlanProducts[0].product
  }, [currentSubscription])

  return {
    subscriptions,
    subscriptionsError,
    subscriptionsStatus,
    currentSubscription,
    currentPlan,
    refetchSubscriptions
  }
}
