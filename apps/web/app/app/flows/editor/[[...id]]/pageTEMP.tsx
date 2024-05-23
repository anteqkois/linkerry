'use client'

import { Heading } from '../../../../(landing)/components/Heading'
import { HeroImage } from '../../../../(landing)/components/HeroImage'
import { PageContainer } from '../../../components/PageContainer'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PageContainer variant={'fromTop'} className="flex-center flex-col">
      <Heading className="pt-10 lg:pt-5">Will be avaible in 1-2 weeks 🎉</Heading>
      <div className="z-10 p-1 pt-20 lg:max-w-4xl lg:pt-12 mx-auto col-span-12 md:col-span-6 skew-y-1 md:skew-y-3">
        <HeroImage />
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary absolute top-[20%] left-[50%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </PageContainer>
  )
}
