'use client'

import {
  AuthStatus,
  CustomError,
  ErrorCode,
  Price,
  Product,
  SubscriptionPeriod,
  SubscriptionStatus,
  isCustomHttpExceptionAxios,
} from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { useAsync } from '@react-hookz/web'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Plans } from '../../../modules/billing/components/Plans'
import { SubscriptionsApi } from '../../../modules/billing/subscriptions'
import { useUser } from '../../../modules/user/useUser'
import { Heading } from './Heading'

export const Pricing = () => {
  const [loading, setLoading] = useState(false)
  const { user, authStatus } = useUser()
  const { push } = useRouter()
  const { toast } = useToast()

  const [state, actions] = useAsync(async () => {
    const { data: subscriptions } = await SubscriptionsApi.getMany()
    if (!subscriptions.length) return undefined

    const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === SubscriptionStatus.ACTIVE)
    if (activeSubscriptions.length !== 1) throw new CustomError(`Invalid amount of active subscriptions`, ErrorCode.INVALID_BILLING)
    return activeSubscriptions[0]
  })

  useEffect(() => {
    if (authStatus !== AuthStatus.AUTHENTICATED) return
    actions.execute()
  }, [authStatus])

  const onSelectPlan = useCallback(async ({ price, productPlan }: { productPlan: Product; price: Price }) => {
    if (!user) return await push('/login')
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
        description: errorMessage.includes('Implemented')
          ? 'Upgrading subscription is now not supported. Contact with our Team and We upgared your plan '
          : errorMessage,
        variant: 'destructive',
      })
      setLoading(false)
    }
  }, [])

  return (
    <section className="flex flex-col items-center pt-10 xl:pt-20 pb-10 xl:pb-28" id="pricing">
      <Heading className="pb-2 xl:pb-4">Best Plan for You</Heading>
      <div className="p-2 max-w-7xl relative">
        {JSON.stringify(state.result)}
        {/* <Plans onSelectPlan={onSelectPlan} loading={loading} currentPlan={currentPlan} /> */}
        <Plans onSelectPlan={onSelectPlan} loading={loading} />
        <div
          className="w-4/5 h-3/6 inline-block rotate-1 bg-primary/30 absolute bottom-[5%] right-[10%] blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
