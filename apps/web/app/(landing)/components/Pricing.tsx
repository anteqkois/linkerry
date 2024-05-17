'use client'

import { useCallback } from 'react'
import { Plans } from '../../../modules/billing/components/Plans'
import { Heading } from './Heading'

export const Pricing = () => {
  const onSelectPlan = useCallback((plan: any) => {
    console.log(plan)
  }, [])

  return (
    <section className="flex flex-col items-center pt-10 xl:pt-20 pb-10 xl:pb-28" id="pricing">
      <Heading className="pb-2 xl:pb-4">Best Plan for You</Heading>
      <div className="p-2 max-w-7xl relative">
        <Plans onSelectPlan={onSelectPlan} />
        <div
          className="w-4/5 h-3/6 inline-block rotate-1 bg-primary/30 absolute bottom-[5%] right-[10%] blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
