import { Button, H2, Icons, Lead } from '@linkerry/ui-components/server'
import Link from 'next/link'
import { PageContainer } from '../../components/PageContainer'

export default function Page() {
  return (
    <PageContainer variant={'centered'} className="flex-col space-y-4">
      <Icons.BadgeCheck className="h-24 w-24 text-positive" />
      <div className="flex-center flex-col">
        <H2 className="lg:text-5xl lg:mb-5">Payment successful</H2>
        {/* <p>Thank you for choosing Linkerry 💜</p> */}
        <Lead>Thank you for choosing Linkerry 💜</Lead>
        <p className='italic'>- linkerry Team</p>
      </div>
      <Link href="/app/dashboard">
        <Button variant={'outline'}>To Dashboard</Button>
      </Link>
    </PageContainer>
  )
}
