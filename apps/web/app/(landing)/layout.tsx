import Link from 'next/link'

import { ModeToggle, buttonVariants } from '@market-connector/ui-components'
import { cn } from '@market-connector/ui-components/lib/utils'
import { MainNav } from '../../components/MianNav'
import { SiteFooter } from '../../components/SiteFooter'
import { marketingConfig } from './config'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav className='flex gap-2 items-center'>
            <Link href="/login" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}>
              Login
            </Link>
            <ModeToggle/>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
