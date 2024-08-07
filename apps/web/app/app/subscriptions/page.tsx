'use client'

import { ChangeSubscriptionResponseType, Price, Product, SubscriptionPeriod, isCustomHttpExceptionAxios, waitMs } from '@linkerry/shared'
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
  const { currentSubscription, currentPlan, subscriptionsError, subscriptionsStatus, refetchSubscriptions } = useSubscriptions()
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
      if (data.type === ChangeSubscriptionResponseType.UPGRADE) {
        toast({
          title: 'Upgrade Plan Successful',
          description: 'Your plan was upgraded. Thanks for choosing Linkerry 💜',
          variant: 'success',
        })
        await waitMs(2_000)
        return await refetchSubscriptions()
      }
      window.location.href = data.checkoutUrl
    } catch (error) {
      let errorMessage = 'Unknown error occures during creation new subscription. Please contact with our Team.'
      if (isCustomHttpExceptionAxios(error)) errorMessage = error.response.data.message

      toast({
        title: 'Payment failed',
        description: errorMessage.includes('Implemented')
          ? 'Upgrading subscription is now not supported. Contact with our Team and We upgared your plan '
          : errorMessage,
        variant: 'destructive',
      })
      setLoading(false)
    }
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
      <Plans onSelectPlan={onSelectPlanConfiguration} currentPlan={currentPlan} loading={loading} />
    </PageContainer>
  )
}
